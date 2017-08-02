import { range, min, max } from 'd3'
import { geoPath, geoDistance, geoInterpolate } from 'd3-geo'

import { annotate } from '../detail'

const ARC_COLOR = 'rgba(255,127,80,.2)'
const FOCUS_ARC_COLOR = 'red'

const SMALL_NETWORK = 7

const LABEL_FONT = '12px Roboto'
const SUBLABEL_FONT = '9px Roboto'


function flowmap(context, projection) {

  let path = geoPath()
    .projection(projection)
    .context(context)

  let weight = constant(1)
  let detail = (x) => x.toString()
  let markerText = (x) => x
  let markerDetail = constant(null)
  let markerPos = constant(0.5)

  let focus = [0,0]
  let cycle = 0

  let origin, destination

  function flowmap(data) {
    let lineWidth = Math.min(4, projection.scale() * 2)
    let fudge = Math.pow(10, -5)

    let source_closest = min(data, (d) => geoDistance(focus, [ d.source_long_def, d.source_lat_def ]))
    let destination_closest = min(data, (d) => geoDistance(focus, [ d.destination_long_def, d.destination_lat_def ]))
    let focus_horizon = min([source_closest, destination_closest]) + fudge
    let focused = []

    data.forEach( (d,i) => {
      let source_dist = geoDistance(focus, [ d.source_long_def, d.source_lat_def ])
      let destination_dist = geoDistance(focus, [ d.destination_long_def, d.destination_lat_def ])

      if(source_dist <= focus_horizon || destination_dist < focus_horizon) {
        arc(d, lineWidth, FOCUS_ARC_COLOR)
        focused.push(i)
      } else {
        arc(d, lineWidth, ARC_COLOR)
      }
    })

    data.forEach( (d) => {
      endpoint(origin(d))
      endpoint(destination(d))
    })

    focused.forEach((i) => {
      let d = data[i]
      let interp = geoInterpolate(origin(d), destination(d))
      let midpoint = interp(0.5)
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

    function endpoint(coordinates) {
      if(!visible(coordinates)) return
      let point = projection(coordinates)

      context.save()
      context.fillStyle = 'white'
      context.strokeStyle = ARC_COLOR
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
    return
  }

  flowmap.weight = function(_) {
    return arguments.length ? (weight = _, flowmap) : weight
  }

  flowmap.detail = function(_) {
    return arguments.length ? (detail = _, flowmap) : detail
  }

  flowmap.markerText = function(_) {
    return arguments.length ? (markerText = _, flowmap) : markerText
  }

  flowmap.markerDetail = function(_) {
    return arguments.length ? (markerDetail = _, flowmap) : markerDetail
  }

  flowmap.markerPos = function(_) {
    return arguments.length ? (markerPos = _, flowmap) : markerPos
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

  function constant(x) {
    return x
  }

  return flowmap
}

export { flowmap }
