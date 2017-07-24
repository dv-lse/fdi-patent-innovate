import { geoPath, geoDistance, geoInterpolate } from 'd3-geo'

const ARC_COLOR = 'coral'

const LABEL_FONT = '18px Roboto'
const SUBLABEL_FONT = '11px Roboto'


function flowmap(context, projection) {

  let path = geoPath()
    .projection(projection)
    .context(context)

  let weight = (x) => 1
  let markers = (x) => []
  let markerText = (x) => x
  let markerDetail = (x) => null

  let cycle = 0

  let origin, destination

  function flowmap(data) {
    let lineWidth = Math.min(7, projection.scale() * 2)

    context.save()

    context.lineCap = 'round'
    context.lineWidth = lineWidth
    context.strokeStyle = ARC_COLOR
    context.setLineDash([5, 15])

    data.forEach( (d, i) => {
      context.beginPath()
      context.lineDashOffset = -Math.floor(cycle * 100 + i * 5)
      // must use GeoJSON so that great arcs are curved according to projection
      path({ type: 'LineString', coordinates: [ origin(d), destination(d) ] })
      context.stroke()
    })

    context.restore()

    data.forEach( (d, i) => {
      let interp = geoInterpolate(origin(d), destination(d))
      let dms = markers(d)

      dms.forEach( (dm, j) => {
        let progress = j / (dms.length-1)
        let endpoint = interp(progress)
        annotate(endpoint, dm, ascending(interp(0.5), endpoint) ? 1 : -1)
      })
    })

    function ascending(a, b) {
      return projection(a)[0] < projection(b)[0]
    }

    function annotate(coordinates, d, label_sign=1) {
      // TODO.  specialised for orthographic projection... use clipExtent too
      let clipAngle = projection.clipAngle()
      let rot = projection.rotate()
      if(geoDistance([-rot[0],-rot[1]], coordinates) > clipAngle * Math.PI / 180) return

      let point = projection(coordinates)
      let dmt = markerText(d)
      let dmd = markerDetail(d)

      label_sign = label_sign >= 0 ? 1 : -1
      context.save()
      context.fillStyle = 'white'
      context.strokeStyle = ARC_COLOR
      context.beginPath()
      context.arc(point[0], point[1], lineWidth, 0, 2 * Math.PI, true)
      context.fill()
      context.stroke()
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
        if(dmd) {
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

  flowmap.cycle = function(_) {
    return arguments.length ? (cycle = +_, flowmap) : cycle
  }

  flowmap.origin = function(_) {
    return arguments.length ? (origin = _, flowmap) : origin
  }

  flowmap.destination = function(_) {
    return arguments.length ? (destination = _, flowmap) : destination
  }

  return flowmap
}

export { flowmap }
