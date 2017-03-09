import * as d3 from 'd3'
import * as schemes from 'd3-scale-chromatic'
import { feature } from 'topojson-client'
import { geoPath, geoGraticule, geoOrthographic, geoArea } from 'd3-geo'

const GLOBE_AREA = geoArea({type: 'Sphere'})

const DEFAULT_QUANTILES = 5

const LEGEND_MARGIN = 20
const LEGEND_HEIGHT = 15
const LEGEND_PADDING = [15, 5, 15, 5]

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
    colors: 'Blues',
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
    let groups = state.flows.split('|')
    let col = state['flow-weight']
    groups.forEach( (g) => {
      if(!flows[g])
        throw "Globe state: cannot identify flow diagram for group " + g
      if(col && !flows[g][0][col])
        throw "Globe state: cannot read flow column " + col + " from group " + g
    })
  }

  // TODO.  better way to check available stat columns
  if(state.choropleth && !(state.choropleth in stats[1])) {
    throw "Globe state: cannot read choropleth column " + state.choropleth
  }

  if(state.thresholds && !(Array.isArray(state.thresholds) && state.thresholds.every( (d,i,a) => {
    return i === 0 || d >= a[i-1]
  }))) {
    throw "Globe state: thresholds must be sorted array of numbers"
  }

  if(state.colors && !schemes['interpolate' + state.colors])
    throw "Globe state: cannot parse color descriptor " + state.colors

  try {
    d3.format(state.format)
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

  let color = d3.scaleLinear()
  let opacity = d3.scaleLinear()
    .range([0.3,0.7])

  let arcs = []

  let omitted = d3.set()

  if(state.choropleth) {
    let values = stats.map( (d) => project(d, state.choropleth))
    values.filter( (d) => d !== null )

    color = d3.scaleQuantile()
      .domain(values)
  }

  if(state.thresholds) {
    color = d3.scaleThreshold()
      .domain(state.thresholds)
  }

  if(state.colors) {
    let interp = schemes['interpolate' + state.colors]
    let num_buckets = 1 + state.thresholds ? state.thresholds.length : DEFAULT_QUANTILES
    let range = d3.range(0,num_buckets).map( (i) => interp(i / num_buckets))
    color.range(range)
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

    // graticule

    context.save()
    context.lineWidth = 1
    context.setLineDash([1, 3])
    context.strokeStyle = '#c9c4bc'
    context.beginPath()
    path( graticule() )
    context.stroke()
    context.restore()

    // land

    context.save()
    context.fillStyle = 'lightgrey'
    context.beginPath()
    path( layers.land )
    context.fill()
    context.restore()

    // country borders

    context.save()
    context.strokeStyle = 'white'
    context.lineWidth = 1
    context.beginPath()
    path( layers.countries )
    context.stroke()
    context.restore()
  }

  function drawChoropleth() {
    // region choropleth
    context.save()

    // regions

    layers.regions.features.forEach( (d) => {
      let value = project(stats[d.id], state.choropleth)
      if(value === null) return

      context.fillStyle = color(value)
      context.beginPath()
      if(geoArea(d) < GLOBE_AREA * .6)  {
        path(d)
        context.fill()
      } else {
        // Paths with large area generally have winding artefacts,
        // and cannot be filled in Canvas.  Record for an error.
        omitted.add(d.id)
      }
    })

    // country borders (again)

    context.save()
    context.strokeStyle = 'white'
    context.lineWidth = 1
    context.beginPath()
    path( layers.countries )
    context.stroke()
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

    // no support for line endings in GeoJSON so do this in Canvas
    // opacity fade at horizon
    let horizon = d3.scaleLinear()
      .domain([Math.PI / 2 * .75, Math.PI / 2 * .90])
      .range([1,0])
      .clamp(true) // necessary since most calls are outside of domain

    data.forEach( (d,i) => {
      let line = {type: 'LineString', coordinates: [ d.from, d.to ]}
      let faded_color = d3.color('coral')
      faded_color.opacity = opacity(d.value)

      context.save()

      context.globalAlpha = 1.0
      context.lineCap = 'round'
      context.lineWidth = weight

      // must use GeoJSON so that great arcs are curved according to projection
      context.beginPath()
      context.strokeStyle = faded_color + ''
      path(line)
      context.stroke()
      context.restore()

      let interp = d3.geoInterpolate(d.from, d.to)
      let bubble = interp((i / data.length + cycle) % 1)

      let rot = projection.rotate()
      let from_distance = d3.geoDistance([-rot[0],-rot[1]], d.from)
      let to_distance = d3.geoDistance([-rot[0],-rot[1]], d.to)
      let bubble_distance = d3.geoDistance([-rot[0],-rot[1]], bubble)

      context.globalAlpha = horizon(bubble_distance)
      circle(context, projection(bubble), weight / 5, 'coral', 'coral')

      context.globalAlpha = horizon(from_distance)
      circle(context, projection(d.from), weight, 'white', 'coral', d.from_label)

      context.globalAlpha = horizon(to_distance)
      circle(context, projection(d.to), weight, 'white', 'coral', d.to_label)

      context.globalAlpha = 1.0
    })
  }

  function drawLegend() {
    if(!state.label) return

    let fmt = state.format ? d3.format(state.format) : d3.format('2s')
    let legend_height = LEGEND_PADDING[0] + (state.choropleth ? LEGEND_HEIGHT : 0) + LEGEND_PADDING[2]

    let x = d3.scaleBand()
      .rangeRound([LEFT_PADDING + (width - LEFT_PADDING) / 2, width - LEGEND_MARGIN])
      .domain(color.range())

    context.save()
    context.fillStyle = 'rgba(255,255,255,.85)'
    context.fillRect(x.range()[0] - LEGEND_PADDING[3],
                     LEGEND_MARGIN - LEGEND_PADDING[0],
                     x.range()[1] - x.range()[0] + LEGEND_PADDING[1] + LEGEND_PADDING[3],
                     legend_height)

    if(state.label) {
      context.fillStyle = 'black'
      context.textBaseline = 'alphabetic'
      context.textAlign = 'left'
      context.fillText(state.label, x.range()[0], LEGEND_MARGIN - 2)
    }

    if(state.choropleth) {
      color.range().map( (c,i) => {
        let high

        if(state.thresholds) {
          high = state.thresholds[i]
        } else {
          high = color.invertExtent(c)[1] || color.domain()[1]
        }

        context.fillStyle = c

        context.fillRect(x(c), LEGEND_MARGIN, x.bandwidth(), LEGEND_HEIGHT)
        context.fillStyle = 'black'
        context.textBaseline = 'hanging'
        context.textAlign = 'right'

        context.fillText(fmt(high), x(c) + x.bandwidth(), LEGEND_MARGIN + LEGEND_HEIGHT + 2)
      })
    }

    context.restore()
  }

  function interaction() {
    // TODO.  might better to alter the values in state.rotation & state.scale
    const TIMEOUT = 1500
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
        let step = !elapsed ? epoch_step : Math.max(0, d3.now() - elapsed - TIMEOUT)
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
    if(state.choropleth) { drawChoropleth() }
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

function circle(context, coords, radius, fill, stroke, label) {
  context.save()
  context.fillStyle = fill
  context.strokeStyle = stroke
  context.beginPath()
  context.arc(coords[0], coords[1], radius, 0, 2 * Math.PI, true)
  context.fill()
  context.stroke()
  if(label) {
    context.fillStyle = 'black'
    context.strokeStyle = 'none'
    context.fillText(label, coords[0] + radius + 2, coords[1] + radius + 2)
  }
  context.restore()
}

function project(d, col) {
  return (d && col in d) ? d[col] : null
}

export { validate, update }
