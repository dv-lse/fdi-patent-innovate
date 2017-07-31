import { scaleLinear, scalePow, extent, range, format } from 'd3'
import { geoPath, geoDistance } from 'd3-geo'

const STROKE = 'rgba(255,255,255,.6)'
const FOCUS_STROKE = 'black'
const FILL = 'lightblue'
const MAX_RADIUS = 15

const LABEL_FONT = '18px Roboto'
const SUBLABEL_FONT = '11px Roboto'

function symbols(context, projection) {

  let values = constant(1)
  let color = constant(FILL)
  let detail = format('d')
  let maxRadius = MAX_RADIUS
  let labels = constant(null)
  let focus = [0,0]

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
    .nice()

  function symbols(stats) {
    symbolscale.range([0,maxRadius])
      .domain(extent(stats, values))

    context.save()

    let dists = stats.map( (d) => d && values(d) ? geoDistance([d.lon, d.lat], focus) : Infinity)
    let closest = +dists.reduce( (c,n,i) => n < dists[c] ? i : c, 0)

    // draw background symbols

    stats.forEach( (d,i) => {
      if(i === closest) return
      draw(d, false)
    })

    // draw and label symbol closest to focus

    draw(stats[closest], true)
    annotate(stats[closest])

    context.restore()
  }

  function draw(d, focused) {
    let value = values(d)
    if(!value) return

    let center = [d['lon'], d['lat']]
    let point = projection(center)
    let radius = Math.abs(symbolscale(value))

    let rot = projection.rotate()
    let distance = geoDistance([-rot[0], -rot[1]], center)

    context.globalAlpha = horizon(distance)

    context.fillStyle = color(d)
    context.strokeStyle = focused ? FOCUS_STROKE : STROKE
    context.beginPath()
    context.arc(point[0], point[1], radius, 0, 2 * Math.PI, true)
    context.fill()
    context.stroke()

    context.globalAlpha = 1.0
  }

  function annotate(d) {
    let value = values(d)
    let info = detail(value)
    let point = projection([d['lon'], d['lat']])
    let radius = Math.abs(symbolscale(value))

    context.font = LABEL_FONT
    context.fillStyle = 'black'
    context.textAlign = 'center'
    context.textBaseline = 'top'

    let em_height = context.measureText('M').width
    let label = labels(d)

    context.fillText(label, point[0], point[1] + radius)
    if(info)
      context.fillText(info, point[0], point[1] + radius + em_height)
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

  symbols.labels = function(_) {
    return arguments.length ? (labels = typeof _ === 'function' ? _ : constant(_), symbols) : labels
  }

  symbols.focus = function(_) {
    return arguments.length ? (focus = _, symbols) : focus
  }

  return symbols
}

function constant(x) { return () => x }

export { symbols }
