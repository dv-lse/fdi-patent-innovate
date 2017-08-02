import * as d3 from 'd3'
import { geoOrthographic } from 'd3-geo'

import { core } from './layers/core'
import { flowmap } from './layers/flowmap'
import { symbols } from './layers/symbols'
import { legend } from './layers/legend'

const SYMBOL_FILL = 'rgba(70,130,180,.6)'
const SYMBOL_RADIUS = 50

const LEFT_PADDING = 360

const AXIS_TILT = 11.5

let projection = geoOrthographic()
  .clipAngle(90)
  .precision(0.6)
  .rotate([ 0.1278, -51.5074, AXIS_TILT ])  // London

let refresh = null  // timer that refreshes globe @ 24fps


function validate(val, flows, stats) {
  let default_state = {
    rotate: projection.rotate(),
    scale: 1,                      // NB should be projection.scale() but this is in different units
    format: '.1s',                 // One digit precision, with abbreviation
    color: SYMBOL_FILL,
    autorotate: false
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
    if(!g)
      throw "Globe state: cannot identify flow diagram for group " + state.flows
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

  // render the globe in new state

  let context = elem.getContext('2d')
  projection.translate([ LEFT_PADDING + (width - LEFT_PADDING) / 2, height / 2])

  let omitted = d3.set()

  // gis layers
  let fmt_region = (r,c) => r ? r + ' (' + c + ')' : c

  let globe = core(context, projection)
  let flowLayer = flowmap(context, projection)
    .origin((d) => [ d.source_long_def, d.source_lat_def ])
    .destination((d) => [ d.destination_long_def, d.destination_lat_def ])
    .detail((d) => state.detail ? [ fmt_region(d.source_region_g, d.source_country_g),
                                    "\u2192 " + fmt_region(d.destination_region_g, d.destination_country_g) ]
                                    .concat(props(d, state.detail)) : null)
  let symbolLayer = symbols(context, projection)
    .values((d) => project(d, state.symbols))
    .detail((d) => state.detail ? [ fmt_region(d.region, d.country) ]
                                  .concat(props(d, state.detail)) : null)
    .color(state.color)
    .maxRadius(state['max-radius'] || SYMBOL_RADIUS)
    .tickFormat(d3.format(',d'))

  if(state.thresholds)
    symbolLayer.ticks(state.thresholds)

  // event handlers

  d3.select(elem).on('mousemove.globe', function() {
    // TODO should be debounced (but then d3.event has already been cleared...)
    let point = d3.mouse(this)
    let coords = projection.invert(point)

    flowLayer.focus(coords)
    symbolLayer.focus(coords)
  })

  d3.select('.scale.up')
    .on('click', () => state.scale = Math.min(state.scale * 1.5, 8))
  d3.select('.scale.down')
    .on('click', () => state.scale = Math.max(state.scale / 1.5, 1))

  // animate globe to updated state

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

        draw()
      }
    })

  function draw(t=1, cycle=0) {
    let legendLayer = legend(context)

    context.clearRect(0, 0, width, height)

    // draw each GIS layer on context in turn

    globe(layers)

    if(state.flows) {
      flowLayer.cycle(cycle)
      flowLayer(flowinfo[state.flows])
      legendLayer.enqueue(flowLayer.drawLegend)
    }

    if(state.symbols) {
      symbolLayer(stats)
      legendLayer.enqueue(symbolLayer.drawLegend)
    }

    if(state.label) {
      context.translate(width,0)
      legendLayer(state.label)
      context.translate(-width,0)
    }
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
      draw(1, cycle)
    }, 38 )
    return loop
  }
}

function project(d, col) {
  return (d && col in d) ? d[col] : null
}

function props(d, cols) {
  if(!cols) return null
  return cols.map( (e) => {
    switch(e.length) {
      case 2: return [ e[0], project(d, e[1]) ]
      case 3: return [ e[0], d3.format(e[2])(project(d, e[1])) ]
      case 4: return [ e[0], d3.format(e[2])(project(d, e[1])) + e[3] ]
      default: return project(d, e)
    }
  })
}

export { validate, update }
