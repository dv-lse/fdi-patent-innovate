import * as d3 from 'd3'
import { geoPath, geoOrthographic } from 'd3-geo'

import { core } from './layers/core'
import { flowmap } from './layers/flowmap'
import { arc_distance } from './util/nvector'

const LEGEND_FONT = '18px Roboto'
const TICK_FONT = '12px Roboto'

const SYMBOL_WIDTH = 50
const SYMBOL_FILL = 'rgba(70,130,180,.6)'
const SYMBOL_STROKE = 'rgba(255,255,255,.6)'

const LEGEND_MARGIN = 15
const LEGEND_HEIGHT = 15
const LEGEND_PADDING = [15, 5, 10, 5]

const LEFT_PADDING = 360

const AXIS_TILT = 11.5

let projection = geoOrthographic()
  .clipAngle(90)
  .precision(0.6)
  .rotate([ 0.1278, -51.5074, AXIS_TILT ])  // London

let path = geoPath()
  .projection(projection)

let refresh = null  // timer that refreshes globe @ 24fps

let focus = {
  coords: null,
  arc: null,
  region: null
}


function validate(val, flows, stats) {
  let default_state = {
    rotate: projection.rotate(),
    scale: 1,                      // NB should be projection.scale() but this is in different units
    format: '.1s',                 // One digit precision, with abbreviation
    color: SYMBOL_FILL,
    autorotate: false,
    legend: true
  }

  let state = Object.assign({}, default_state, val)

  if(!(state.rotate &&
       Array.isArray(state.rotate) &&
       state.rotate.length >= 2 &&
       state.rotate.length <= 3 &&
       state.rotate.every( (d) => typeof d === 'number'))) {
    throw "Globe state: cannot read rotate from " + JSON.stringify(state)
  }

  if(state.rotate.length < 3) {
    state.rotate[2] = AXIS_TILT
  }

  if(!(state.scale &&
       typeof state.scale === 'number'))
    throw "Globe state: cannot read scale from " + JSON.stringify(state)

  if(state.flows) {
    let g = flows[state.flows]
    let col = state['flow-weight']
    if(!g)
      throw "Globe state: cannot identify flow diagram for group " + state.flows
    if(col && !g[0][col])
      throw "Globe state: cannot read flow column " + col + " from group " + state.flows
  }

  // TODO.  better way to check available stat columns
  if(state.symbols && !(state.symbols in stats[1])) {
    throw "Globe state: cannot read symbols column " + state.symbols
  }

  if(state.thresholds && !(Array.isArray(state.thresholds) && state.thresholds.every( (d,i,a) => {
    return i === 0 || d >= a[i-1]
  }))) {
    throw "Globe state: thresholds must be sorted array of numbers"
  }

  try {
    Array.isArray(state.format) || d3.format(state.format)
  } catch(e) {
    throw "Globe state: cannot parse format descriptor " + state.format
  }

  return state
}

function update(canvas, layers, stats, flowinfo, state) {
  let elem = canvas.node()
  let bounds = elem.getBoundingClientRect()

  let width = bounds.right - bounds.left
  let height = bounds.bottom - bounds.top

  // validate application state / narrative

  state = validate(state, flowinfo, stats)

  // install event handlers

  d3.select(elem).on('mousemove.globe', function() {
    // TODO should be debounced (but then d3.event has already been cleared...)

    let point, arcs, dists, id
    let radius = +state['flow-hover-radius']

    point = d3.mouse(this)
    focus.coords = projection.invert(point)

    if(state.flows) {
      arcs = flowinfo[state.flows]
      dists = arcs.map( (d) => Math.min(distance(point, projection([d.source_long_def, d.source_lat_def])),
                                        distance(point, projection([d.destination_long_def, d.destination_lat_def]))) )
      focus.endpoints = dists.reduce( (o, n, i) => n < radius ? (o[i] = true, o) : o, {})

      dists = arcs.map( (d) => arc_distance([ d.source_long_def, d.source_lat_def ],
                                            [ d.destination_long_def, d.destination_lat_def ],
                                            focus.coords))
      idx = +dists.reduce( (closest, next, i) => next < dists[closest] ? i : closest, 0)
      focus.arc_id = arcs[idx].id

      // console.log(dists.map((d,i) => (arcs[i].id===focus.arc_id ? '*' : '') + arcs[i].id + ':' + d).join(' '))
    }

    dists = d3.keys(stats).reduce( (o, id) => (o[id] = d3.geoDistance([stats[id].lon, stats[id].lat], focus.coords), o), {})
    focus.region = +d3.keys(dists).reduce( (closest, id) => dists[id] < dists[closest] ? id : closest, 1)
  })

  // TODO.  animation through the zoom
  d3.select('.scale.up')
    .on('click', () => state.scale = Math.min(state.scale * 1.5, 8))
  d3.select('.scale.down')
    .on('click', () => state.scale = Math.max(state.scale / 1.5, 1))

  // render the globe in new state

  let opacity = d3.scaleLinear()
    .range([0.5,1])

  let symbolscale = d3.scalePow()
    .exponent(0.5)
    .range([0,SYMBOL_WIDTH])

  let omitted = d3.set()

  if(state.symbols) {
    let values = stats.map( (d) => project(d, state.symbols))
    values.filter( (d) => d !== null )

    symbolscale.domain(d3.extent(values))
      .nice()
  }

  if(state['max-size']) {
    let size = state['max-size']
    symbolscale.range([0,size])
  }

  if(state.flows) {
    // opacity.domain(d3.extent(arcs, (d) => d.weight || 1))
  }

  let context = elem.getContext('2d')
  projection.translate([ LEFT_PADDING + (width - LEFT_PADDING) / 2, height / 2])

  path.context(context)


  function drawSymbols() {

    // opacity fade at horizon
    let horizon = d3.scaleLinear()
      .domain([Math.PI / 2 * .75, Math.PI / 2 * .90])
      .range([1,0])
      .clamp(true) // necessary since most calls are outside of domain

    context.save()

    stats.forEach( (d) => {
      let value = project(d, state.symbols)
      if(value === null) return

      let radius = Math.abs(symbolscale(value))

      let coords = [ d['lon'], d['lat'] ]

      let rot = projection.rotate()
      let distance = d3.geoDistance([-rot[0],-rot[1]], coords)
      if(distance > Math.PI / 2) return

      context.globalAlpha = horizon(distance)
      circle(context, projection(coords), radius, state.color, SYMBOL_STROKE)
      context.globalAlpha = 1.0
    })

    context.restore()
  }

  function drawLegend() {
    if(!state.label) return

    let fmt = d3.format('2s')
    if(state.format)
      fmt = Array.isArray(state.format) ? (d,i) => state.format[i] : d3.format(state.format)

    let em_height = context.measureText('M').width
    let legend_height = LEGEND_PADDING[0] + (state.symbols && state.legend ? LEGEND_HEIGHT + SYMBOL_WIDTH * 2 : 0) + LEGEND_PADDING[2]

    let top = LEGEND_MARGIN //- LEGEND_PADDING[0] - em_height
    let legend_width = 300 // width - LEGEND_MARGIN - LEFT_PADDING + (width - LEFT_PADDING) / 2 + LEGEND_PADDING[1] + LEGEND_PADDING[3]
    let left = width - LEGEND_MARGIN * 2 - legend_width // LEFT_PADDING + (width - LEFT_PADDING) / 2 - LEGEND_PADDING[3]

    context.save()
    context.fillStyle = 'lightgray' //'rgba(255,255,255,.95)'
    context.fillRect(left, top, legend_width, legend_height)
    context.strokeStyle = 'black'
    context.strokeRect(left, top, legend_width, legend_height)

    if(state.label) {
      context.fillStyle = 'black'
      context.textBaseline = 'bottom'
      context.textAlign = 'left'
      context.font = LEGEND_FONT
      context.fillText(state.label, left + LEGEND_PADDING[3], LEGEND_MARGIN + LEGEND_PADDING[0] + em_height)
    }

    if(state.symbols && state.legend) {
      let ticks = (state.thresholds || symbolscale.ticks(4)).slice().reverse()
      let coords = ticks.map( (c) => {
        let radius = Math.abs(symbolscale(c))
        let coords = [left + legend_width / 3, top + legend_height - LEGEND_PADDING[2] - radius]
        return { value: c, radius: radius, coords: coords }
      })

      coords.forEach( (d) => circle(context, d.coords, d.radius, state.color, SYMBOL_STROKE) )

      context.font = '12px sans-serif'
      context.textBaseline = 'middle'
      context.textAlign = 'right'
      context.strokeStyle = 'white'
      context.fillStyle = 'black'

      coords.forEach( (d, i) => {
        if(d.value === 0) return
        let offset = SYMBOL_WIDTH * 3/2
        context.beginPath()
        context.moveTo(d.coords[0], d.coords[1] - d.radius)
        context.lineTo(d.coords[0] + offset, d.coords[1] - d.radius)
        context.stroke()
        context.fillText(fmt(d.value), d.coords[0] + offset + 50, d.coords[1] - d.radius)
      })
      context.restore()
    }

    context.restore()
  }

  function interaction() {
    // TODO.  might better to alter the values in state.rotation & state.scale
    let m0, o0, m1
    let o1 = [-state.rotate[0],-state.rotate[1]]

    let elapsed = d3.now()

    let dragged = d3.drag()
      .on('start.interaction', () => {
        let proj = state.rotate || projection.rotate()
        m0 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY]
        o0 = [-proj[0],-proj[1]]
      })
      .on('drag.interaction', () => {
        if (m0) {
          m1 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY]
          o1 = [o0[0] + (m0[0] - m1[0]) / 4 / state.scale, o0[1] + (m1[1] - m0[1]) / 4 / state.scale]
          state.rotate = [-o1[0], -o1[1], AXIS_TILT]
          projection.rotate(state.rotate)
          elapsed = d3.now()
        }
      })

    // See http://mbostock.github.io/d3/talk/20111018/azimuthal.html
    d3.select(elem)
      .call(dragged)

    let loop = d3.interval( (epoch_step) => {
      let cycle = (Math.floor(epoch_step / 100) % 100) / 100
      if(state.autorotate) {
        let step = !elapsed ? epoch_step : Math.max(0, d3.now() - elapsed)
        state.rotate = [-o1[0] + (step * 0.002) % 360, -o1[1], AXIS_TILT]
      }
      projection.rotate(state.rotate)
        .scale(state.scale * Math.min(width, height) / 2)
      drawThematic(1, cycle)
      drawLegend()
    }, 38 )
    return loop
  }

  function drawCursor() {
    const hover_color = 'rgba(255,255,255,.3)'

    if(state['flow-hover-radius'] && focus.coords)
      circle(context, projection(focus.coords), +state['flow-hover-radius'], hover_color, hover_color)
  }

  function drawThematic(t=1, cycle=0) {
    context.clearRect(0, 0, width, height)

    let globe = core(context, projection)
    let flowLayer = flowmap(context, projection)
      .origin((d) => [ d.source_long_def, d.source_lat_def ])
      .destination((d) => [ d.destination_long_def, d.destination_lat_def ])
      .markers((d) => state.markers ? state.markers.map( (m) => [d,m] ) : [])
      .markerText((d) => project(d[0], d[1].label))
      .markerDetail((d) => focus.arc_id === d[0].id ? project(d[0], d[1].detail) : null)

    // draw each GIS layer in turn

    globe(layers)
    if(state.flows) {
      flowLayer.cycle(cycle)
      flowLayer(flowinfo[state.flows])
    }

    /*
    if(state['flow-hover-radius']) { drawCursor() }
    // TODO.  move flows to separate animation sequence
    if(state.flows) {
      flows.draw(context, projection, arcs, cycle)
      // clean, but how to configure focus on arc to show sublabels?
      (a) mouse over one arc to show sublabels data
      (b) highlight arcs with endpoints near focus point
      (c) nothing

      sublabels are series of pairs with label, formatted value
    }
    */
    /*
    if(state.symbols) { drawSymbols() }
    */
  }

  d3.transition()
    .duration(1500)
    .on('end', () => {
      if(!omitted.empty()) {
        console.log('Omitted regions due to winding errors: ' + JSON.stringify(omitted.values()))
      }
      refresh = interaction()
    })
    .tween('spin', () => {
      elem.__state = elem.__state || state

      // TODO.  clarify this logic -- it turns out we only want to interpolate rotate & scale
      elem.__state.color = state.color
      elem.__state.label = state.label

      let interp = d3.interpolate(elem.__state, state)

      if(refresh) { refresh.stop() }

      return (t) => {
        elem.__state = state = interp(t)

        projection.rotate(state.rotate)
          .scale(state.scale * Math.min(width, height) / 2)

        drawThematic()
        drawLegend()
      }
    })
}

function distance(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
}

function project(d, col) {
  return (d && col in d) ? d[col] : null
}

export { validate, update }
