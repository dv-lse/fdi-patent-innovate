import { range, min, max, extent, scaleLinear, color } from 'd3'
import { geoPath, geoDistance, geoInterpolate } from 'd3-geo'

import { annotate } from '../detail'

const ARC_COLOR = 'coral'
const FOCUS_ARC_COLOR = 'red'

const SMALL_NETWORK = 7

const LABEL_FONT = '12px Roboto'
const SUBLABEL_FONT = '9px Roboto'


let horizon = scaleLinear()
  .domain([Math.PI / 2 * .7, Math.PI / 2 * .85])
  .range([1,0])
  .clamp(true)

function flowmap(context, projection) {

  let path = geoPath()
    .projection(projection)
    .context(context)

  let opacity = scaleLinear()
    .range([0.5,1.0])

  let weight = constant(1)
  let detail = (x) => x.toString()
  let detailOffset = constant(0.5)

  let focus = null
  let focusOverride = constant(null)

  let cycle = 0

  let origin, destination

  function flowmap(data) {
    let focusDistance = (p) => focus ? geoDistance(focus, p) : Infinity

    let lineWidth = Math.min(4, projection.scale() * 2)
    let fudge = Math.pow(10, -5)

    let source_closest = min(data, (d) => focusDistance([ d.source_long_def, d.source_lat_def ]))
    let destination_closest = min(data, (d) => focusDistance([ d.destination_long_def, d.destination_lat_def ]))
    let focus_horizon = focus ? min([source_closest, destination_closest]) + fudge : 0
    let focused = []

    opacity.domain(extent(data, weight))

    data.forEach( (d,i) => {
      let source_dist = focusDistance([ d.source_long_def, d.source_lat_def ])
      let destination_dist = focusDistance([ d.destination_long_def, d.destination_lat_def ])
      let override = focusOverride(d)
      let close = source_dist <= focus_horizon || destination_dist < focus_horizon

      if(override || (override === null && close)) {
        arc(d, lineWidth, FOCUS_ARC_COLOR)
        focused.push(i)
      } else {
        let c = color(ARC_COLOR)
        c.opacity = opacity(weight(d))
        arc(d, lineWidth, c + '')
      }
    })

    data.forEach( (d) => {
      let origin_coords = origin(d)
      let dest_coords = destination(d)

      endpoint(origin_coords, focusDistance(origin_coords) < focus_horizon)
      endpoint(dest_coords, focusDistance(dest_coords) < focus_horizon)
    })

    focused.forEach((i) => {
      let d = data[i]
      let offset = detailOffset(d)
      let interp = geoInterpolate(origin(d), destination(d))
      let midpoint = interp(offset)
      annotate(context, projection(midpoint), detail(d))
    })

    function arc(d, width, color) {
      context.save()

      context.lineCap = 'round'
      context.lineWidth = width
      context.strokeStyle = color
      context.setLineDash([5, 15])
      context.lineDashOffset = -Math.floor(cycle * 100)

      context.beginPath()
      // must use GeoJSON so that great arcs are curved according to projection
      path({ type: 'LineString', coordinates: [ origin(d), destination(d) ] })
      context.stroke()

      context.restore()
    }

    function endpoint(coordinates, focused) {
      let point = projection(coordinates)
      let rot = projection.rotate()
      let distance = geoDistance([-rot[0], -rot[1]], coordinates)

      context.save()

      context.globalAlpha = horizon(distance)

      context.fillStyle = focused ? FOCUS_ARC_COLOR : 'white'
      context.strokeStyle = focused ? 'white' : ARC_COLOR
      context.beginPath()
      context.arc(point[0], point[1], lineWidth, 0, 2 * Math.PI, true)
      context.fill()
      context.stroke()

      context.restore()
    }

    function visible(coordinates) {
      let clipAngle = projection.clipAngle()
      let rot = projection.rotate()

      return geoDistance([-rot[0],-rot[1]], coordinates) < clipAngle * Math.PI / 180
    }

    function ascending(a, b) {
      return projection(a)[0] < projection(b)[0]
    }
  }

  flowmap.drawLegend = function() {
    // no legend implemented for flow maps yet...
    return
  }

  flowmap.weight = function(_) {
    return arguments.length ? (weight = typeof _ === 'function' ? _ : constant(_), flowmap) : weight
  }

  flowmap.detail = function(_) {
    return arguments.length ? (detail = _, flowmap) : detail
  }

  flowmap.detailOffset = function(_) {
    return arguments.length ? (detailOffset = typeof _ === 'function' ? _ : constant(_), flowmap) : detailOffset
  }

  flowmap.cycle = function(_) {
    return arguments.length ? (cycle = +_, flowmap) : cycle
  }

  flowmap.origin = function(_) {
    return arguments.length ? (origin = _, flowmap) : origin
  }

  flowmap.destination = function(_) {
    return arguments.length ? (destination = _, flowmap) : destination
  }

  flowmap.focus = function(_) {
    return arguments.length ? (focus = _, flowmap) : focus
  }

  flowmap.focusOverride = function(_) {
    return arguments.length ? (focusOverride = typeof _ === 'function' ? _ : constant(_), flowmap) : focusOverride
  }

  function constant(x) {
    return () => x
  }

  return flowmap
}

export { flowmap }
