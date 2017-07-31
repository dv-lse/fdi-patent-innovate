import { range, max } from 'd3'
import { geoPath, geoDistance, geoInterpolate } from 'd3-geo'

import { arc_distance } from '../util/nvector'

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
  let markers = (x) => x.toString()
  let markerText = (x) => x
  let markerDetail = constant(null)
  let markerPos = constant(0.5)

  let focus = [0,0]
  let cycle = 0

  let origin, destination

  function flowmap(data) {
    let lineWidth = Math.min(4, projection.scale() * 2)

    let dists = data.map( (d) => arc_distance([ d.source_long_def, d.source_lat_def ],
                                              [ d.destination_long_def, d.destination_lat_def ],
                                              focus))
    let closest = +dists.reduce( (c,n,i) => n < dists[c] ? i : c, 0)

    data.forEach( (d,i) => {
      arc(d, lineWidth, i != closest ? ARC_COLOR : FOCUS_ARC_COLOR)

      if(focus) {
        let dist = arc_distance(origin(d), destination(d), focus)
        if(dist < closest.dist) {
          closest.dist = dist
          closest.data = d
        }
      }
    })

    data.forEach( (d) => {
      endpoint(origin(d))
      endpoint(destination(d))
    })

    annotate(data[closest])

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

    function annotate(d) {
      let label = markers(d)
      let interp = geoInterpolate(origin(d), destination(d))

      let tacks = range(.2,1,.2).map(interp)
      let dists = tacks.map((e) => geoDistance(focus, e))
      let best = dists.reduce((c,n,i) => n < dists[c] ? i : c, 0)

      let point = projection(tacks[best])

      if(label) {
        const padding = 3

        context.save()
        context.font = LABEL_FONT
        let em_height = context.measureText('M').width * 1.5
        let widths = label.map( (e) => context.measureText(e).width )

        context.fillStyle = 'rgba(255,255,255,0.8)'
        context.fillRect(point[0] - padding, point[1] - em_height - padding, max(widths) + padding * 2, label.length * em_height + padding * 2)

        context.fillStyle = 'black'

        label.forEach((d,i) => {
          context.fillText(d, point[0], point[1] + i * em_height)
        })

        context.restore()
      }
    }

    /*
      let interp = geoInterpolate(origin(d), destination(d))
      let dms = markers(d)
      let focused = closest.data && closest.data.id === d.id

      dms.forEach( (dm, j) => {
        let progress = j / (dms.length-1)
        let endpoint = interp(progress)
        annotate(endpoint, dm, ascending(interp(0.5), endpoint) ? 1 : -1, focused)
      })
      */

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

/*
    function annotate(coordinates, d, label_sign=1, focused=false) {
      if(!visible(coordinates)) return

      let point = projection(coordinates)
      let dmt = markerText(d)
      let dmd = markerDetail(d)

      label_sign = label_sign >= 0 ? 1 : -1
      if(dmt) {
        context.font = LABEL_FONT
        let margin = 5
        let width = context.measureText(dmt).width
        let height = context.measureText('M').width
        let x = point[0] + (lineWidth + margin) * label_sign
        let y = point[1] + height / 2
        x = label_sign > 0 ? x : x - width
        context.fillStyle = 'black'
        context.fillText(dmt, x, y)

        if(focused && dmd) {
          context.font = SUBLABEL_FONT
          let detail_width = context.measureText(dmd).width
          let detail_height = context.measureText('M').width
          let baseline = [x, y + detail_height + margin]
          context.fillStyle = 'rgba(255,255,255,.5)'
          context.fillRect(baseline[0] - margin / 2, baseline[1] - detail_height - margin / 2, detail_width + margin, detail_height + margin)
          context.fillStyle = 'black'
          context.fillText(dmd, baseline[0], baseline[1])
        }
      }
      context.restore()
    }
    */

    function visible(coordinates) {
      let clipAngle = projection.clipAngle()
      let rot = projection.rotate()

      return geoDistance([-rot[0],-rot[1]], coordinates) < clipAngle * Math.PI / 180
    }

    function ascending(a, b) {
      return projection(a)[0] < projection(b)[0]
    }
  }

  flowmap.weight = function(_) {
    return arguments.length ? (weight = _, flowmap) : weight
  }

  flowmap.markers = function(_) {
    return arguments.length ? (markers = _, flowmap) : markers
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
