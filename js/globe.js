import * as d3 from 'd3'
import * as schemes from 'd3-scale-chromatic'
import { feature } from 'topojson-client'
import { geoPath, geoGraticule, geoOrthographic, geoArea } from 'd3-geo'

const GLOBE_AREA = geoArea({type: 'Sphere'})

const DEFAULT_QUANTILES = 5

const LABEL_FONT = '18px Roboto'
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

let graticule = geoGraticule()

let refresh = null  // timer that refreshes globe @ 24fps


function validate(val, flows, stats) {
  let default_state = {
    rotate: projection.rotate(),
    scale: 1,                      // NB should be projection.scale() but this is in different units
    format: '.1s',                 // One digit precision, with abbreviation
    autorotate: true
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

function update(canvas, layers, stats, flows, state) {
  let elem = canvas.node()
  let bounds = elem.getBoundingClientRect()

  let width = bounds.right - bounds.left
  let height = bounds.bottom - bounds.top

  // validate application state / narrative

  state = validate(state, flows, stats)

  // install event handlers

  d3.select(elem).on('click.globe', function() {
    let pos = projection.invert(d3.mouse(this))
    console.log(pos)
    // TODO.  determine which region contains the point and show stats
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

  // no support for line endings in GeoJSON so do this in Canvas
  // opacity fade at horizon
  let horizon = d3.scaleLinear()
    .domain([Math.PI / 2 * .75, Math.PI / 2 * .90])
    .range([1,0])
    .clamp(true) // necessary since most calls are outside of domain

  let arcs = []

  let omitted = d3.set()

  if(state.symbols) {
    let values = stats.map( (d) => project(d, state.symbols))
    values.filter( (d) => d !== null )

    symbolscale.domain(d3.extent(values))
      .nice()
  }

  if(state.flows) {
    let groups = state.flows.split('|')
    groups.forEach( (g) => arcs = arcs.concat(flows[g]) )

    if(state['flow-weight']) {
      let values = arcs.map( (d) => project(d, state['flow-weight']))
      values.filter( (d) => d !== null )
      opacity.domain(d3.extent(values))
    }
  }

  let context = elem.getContext('2d')
  projection.translate([ LEFT_PADDING + (width - LEFT_PADDING) / 2, height / 2])

  path.context(context)

  // TODO.  move partials somewhere more logical...
  function drawCore() {
    context.clearRect(0, 0, width, height)

    // Ocean background

    context.save()
    context.fillStyle = 'rgba(173,216,230,.4)'
    path({type:'Sphere'})
    context.fill()
    context.restore()

    // graticule

    context.save()
    context.lineWidth = .5
    context.strokeStyle = 'rgba(0,0,0,.2)'
    context.beginPath()
    path( graticule() )
    context.stroke()
    context.restore()

    // land

    context.save()
    context.fillStyle = 'darkgrey'
    context.beginPath()
    path( layers.land )
    context.fill()
    context.restore()

    // country borders

    context.save()
    context.strokeStyle = 'rgba(255,255,255,.5)'
    context.lineWidth = 1.5
    context.beginPath()
    path( layers.countries )
    context.stroke()
    context.restore()

    // region borders
    if(projection.scale() > 500) {
      context.save()
      context.strokeStyle = 'rgba(255,255,255,0.2)'
      context.lineWidth = 1
      context.beginPath()
      path( layers.regions )
      context.stroke()
    }
  }

  function drawSymbols() {
    context.save()
    layers.symbols.features.forEach( (f) => {
      let value = project(stats[f.id], state.symbols)
      if(value === null) return

      let radius = symbolscale(value)

      let coords = f.geometry.coordinates

      let rot = projection.rotate()
      let distance = d3.geoDistance([-rot[0],-rot[1]], coords)
      if(distance > Math.PI / 2) return

      context.globalAlpha = horizon(distance)
      circle(context, projection(coords), radius, SYMBOL_FILL, SYMBOL_STROKE)
      context.globalAlpha = 1.0
    })

    context.restore()
  }

  function drawFlows(cycle) {
    let data = arcs.map( (d) => {
        return { from: [d.source_long_def, d.source_lat_def],
                   to: [d.destination_long_def, d.destination_lat_def],
                 from_label: project(d, state['origin-labels']),
                 to_label: project(d, state['destination-labels']),
                 value: project(d, state['flow-weight']) }
      })

    let weight = state.scale * 2.5  /* alter line width here if necessary */

    // arcs

    data.forEach( (d,i) => {
      let line = {type: 'LineString', coordinates: [ d.from, d.to ]}
      let highlight = state['highlight-over'] && d.value > +state['highlight-over']
      let faded_color = highlight ? d3.color('red') : d3.color('coral')
      faded_color.opacity = opacity(d.value)

      context.save()

      context.globalAlpha = 1.0
      context.lineCap = 'round'
      context.lineWidth = weight

      // must use GeoJSON so that great arcs are curved according to projection
      context.beginPath()
      context.strokeStyle = faded_color + ''
      context.setLineDash([5, 15])
      context.lineDashOffset = -Math.floor(cycle * 100)
      path(line)
      context.stroke()
      context.restore()

      let rot = projection.rotate()
      let from_distance = d3.geoDistance([-rot[0],-rot[1]], d.from)
      let to_distance = d3.geoDistance([-rot[0],-rot[1]], d.to)

      context.globalAlpha = horizon(from_distance)
      circle(context, projection(d.from), weight, 'white', 'coral', d.from_label, 1)

      context.globalAlpha = horizon(to_distance)
      circle(context, projection(d.to), weight, 'white', 'coral', d.to_label, -1)

      context.globalAlpha = 1.0
    })
  }

  function drawLegend() {
    if(!state.label) return

    let fmt = d3.format('2s')
    if(state.format)
      fmt = Array.isArray(state.format) ? (d,i) => state.format[i] : d3.format(state.format)

    let em_height = context.measureText('M').width
    let legend_height = LEGEND_PADDING[0] + (state.symbols ? LEGEND_HEIGHT + SYMBOL_WIDTH * 2 : 0) + LEGEND_PADDING[2]

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

    if(state.symbols) {
      let ticks = (state.thresholds || symbolscale.ticks(4)).slice().reverse()
      let coords = ticks.map( (c) => {
        let radius = symbolscale(c)
        let coords = [left + legend_width / 3, top + legend_height - LEGEND_PADDING[2] - radius]
        return { value: c, radius: radius, coords: coords }
      })

      coords.forEach( (d) => circle(context, d.coords, d.radius, SYMBOL_FILL, SYMBOL_STROKE) )

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

/*
    if(state.symbols) {
      symbolscale.range().map( (c,i) => {
        let high

        if(state.thresholds) {
          high = state.thresholds[i]
        } else {
          high = symbolscale.domain()[1]
        }

        context.fillStyle = c

        context.fillRect(x(c), LEGEND_MARGIN, x.bandwidth(), LEGEND_HEIGHT)
        context.fillStyle = 'black'
        context.textBaseline = 'top'
        context.textAlign = 'right'
        context.font = TICK_FONT

        context.fillText(fmt(high, i), x(c) + x.bandwidth(), LEGEND_MARGIN + LEGEND_HEIGHT + 2)
      })
    }
*/

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
        state.rotate = [-o1[0] + (step * 0.01) % 360, -o1[1], AXIS_TILT]
      }
      projection.rotate(state.rotate)
        .scale(state.scale * Math.min(width, height) / 2)
      drawThematic(1, cycle)
      drawLegend()
    }, 38 )
    return loop
  }

  function drawThematic(t=1, cycle=0) {
    drawCore()
    if(state.symbols) { drawSymbols() }
    // TODO.  move flows to separate animation sequence
    if(arcs) { drawFlows(cycle) }
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
      let interp = d3.interpolate(elem.__state, state)

      if(refresh) { refresh.stop() }

      return (t) => {
        elem.__state = state = interp(t)
        projection.rotate(state.rotate)
          .scale(state.scale * Math.min(width, height) / 2)

        drawCore()
        drawThematic()
        drawLegend()
      }
    })
}

function circle(context, coords, radius, fill, stroke=null, label=null, label_sign=1) {
  label_sign = label_sign >= 0 ? 1 : -1
  context.save()
  context.fillStyle = fill
  if(stroke)
    context.strokeStyle = stroke
  context.beginPath()
  context.arc(coords[0], coords[1], radius, 0, 2 * Math.PI, true)
  context.fill()
  if(stroke)
    context.stroke()
  if(label) {
    context.font = LABEL_FONT
    let padding = 5
    let width = context.measureText(label).width + padding * 2
    let height = context.measureText('M').width + padding * 2
    let x = coords[0] + (radius + padding * 2) * label_sign
    let y = coords[1]
    x = label_sign > 0 ? x : x - width
    context.fillStyle = 'rgba(255,255,255,1)'
    context.fillRect(x, y - height / 2, width, height)
    context.fillStyle = context.strokeStyle = 'rgba(0,0,0,.7)'
    context.strokeRect(x, y - height / 2, width, height)
    context.fillText(label, x + padding, y + padding)
  }
  context.restore()
}

function project(d, col) {
  return (d && col in d) ? d[col] : null
}

export { validate, update }
