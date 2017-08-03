import { scaleLinear, scalePow, max, range, format } from 'd3'
import { geoPath, geoDistance } from 'd3-geo'

import { annotate } from '../detail'

const STROKE = 'rgba(255,255,255,.6)'
const FOCUS_STROKE = 'black'
const FILL = 'lightblue'
const MAX_RADIUS = 15

const ANNOTATE_OFFSET = 3
const LEGEND_TICKOFFSET = 1.5
const LEGEND_PADDING = 5
const TICK_FONT = '10pt Roboto'

function symbols(context, projection) {

  let values = constant(1)
  let color = constant(FILL)
  let detail = format('d')
  let maxRadius = MAX_RADIUS
  let focus = [0,0]
  let tickFormat = (d) => d + ''
  let ticks = constant(null)

  let path = geoPath()
    .projection(projection)
    .context(context)

  // opacity fade at horizon
  let horizon = scaleLinear()
    .domain([Math.PI / 2 * .7, Math.PI / 2 * .85])
    .range([1,0])
    .clamp(true) // necessary since most calls are outside of domain

  let symbolscale = scalePow()
    .exponent(0.5)
    .clamp(true)
    .nice()

  function symbols(stats) {
    symbolscale.range([0, maxRadius])
      .domain([0, max(stats, values)])

    context.save()

    let dists = stats.map( (d) => d && values(d) ? geoDistance([d.lon, d.lat], focus) : Infinity)
    let closest = +dists.reduce( (c,n,i) => n < dists[c] ? i : c, 0)

    // draw background symbols

    stats.forEach( (d,i) => {
      if(i === closest) return
      draw(d, false)
    })

    context.restore()

    // draw and label symbol closest to focus

    let d = stats[closest]
    let point = projection([d['lon'], d['lat']])

    point[1] += radius(d) + ANNOTATE_OFFSET

    draw(d, true)
    annotate(context, point, detail(d))
  }

  function radius(d) {
    let value = values(d)
    return symbolscale(value)
  }

  function draw(d, focused) {
    if(!(values(d))) return

    let center = [d['lon'], d['lat']]
    let point = projection(center)

    let rot = projection.rotate()
    let distance = geoDistance([-rot[0], -rot[1]], center)

    context.globalAlpha = horizon(distance)

    context.fillStyle = color(d)
    context.strokeStyle = focused ? FOCUS_STROKE : STROKE
    context.beginPath()
    context.arc(point[0], point[1], radius(d), 0, 2 * Math.PI, true)
    context.fill()
    context.stroke()

    context.globalAlpha = 1.0
  }

  symbols.values = function(_) {
    return arguments.length ? (values = typeof _ === 'function' ? _ : constant(+_), symbols) : values
  }

  symbols.color = function(_) {
    return arguments.length ? (color = typeof _ === 'function' ? _ : constant(_), symbols) : color
  }

  symbols.detail = function(_) {
    return arguments.length ? (detail = typeof _ === 'function' ? _ : constant(_), symbols) : detail
  }

  symbols.maxRadius = function(_) {
    return arguments.length ? (maxRadius = +_, symbols) : maxRadius
  }

  symbols.focus = function(_) {
    return arguments.length ? (focus = _, symbols) : focus
  }

  symbols.tickFormat = function(_) {
    return arguments.length ? (tickFormat = typeof _ === 'function' ? _ : constant(_), symbols) : tickFormat
  }

  symbols.ticks = function(_) {
    return arguments.length ? (ticks = typeof _ === 'function' ? _ : constant(_), symbols) : ticks
  }

  symbols.drawLegend = function() {
    context.save()

    context.font = TICK_FONT
    context.textBaseline = 'middle'
    context.textAlign = 'left'

    let em_height = context.measureText('M').width

    let thresholds = ticks() || symbolscale.ticks(5)
    let max_r = symbolscale(thresholds[thresholds.length-1])

    let coords = thresholds.map( (c) => {
      let r = symbolscale(c)
      let coords = [LEGEND_PADDING + max_r, LEGEND_PADDING + em_height + max_r * 2 - r]
      return { value: c, radius: r, coords: coords }
    })

    coords.reverse().forEach( (d) => {
      context.fillStyle = color()
      context.strokeStyle = STROKE
      context.beginPath()
      context.arc(d.coords[0], d.coords[1], d.radius, 0, 2 * Math.PI, true)
      context.fill()
      context.stroke()
    })
    context.strokeStyle = 'white'
    context.fillStyle = 'black'

    coords.forEach( (d, i) => {
      if(d.value === 0) return
      context.beginPath()
      context.moveTo(d.coords[0], d.coords[1] - d.radius)
      context.lineTo(d.coords[0] + max_r * LEGEND_TICKOFFSET, d.coords[1] - d.radius)
      context.stroke()
      context.fillText(tickFormat(d.value), d.coords[0] + max_r * LEGEND_TICKOFFSET + 5, d.coords[1] - d.radius)
    })

    context.restore()
  }

  symbols.drawLegend.height = function() {
    let thresholds, em_height

    thresholds = ticks()
    if(!thresholds || thresholds.length === 0) return 0

    context.save()
    context.font = TICK_FONT
    em_height = context.measureText('M').width
    context.restore()

    return symbolscale.range()[1] * 2 + em_height * 1.5
  }

  symbols.drawLegend.width = function() {
    return symbolscale.range()[1] * 3
  }

  return symbols
}

function constant(x) { return () => x }

export { symbols }
