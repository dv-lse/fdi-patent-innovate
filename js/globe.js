import * as d3 from 'd3'
import * as schemes from 'd3-scale-chromatic'
import { feature } from 'topojson-client'
import { geoPath, geoGraticule, geoOrthographic } from 'd3-geo'

let projection = geoOrthographic()
  .clipAngle(90)
  .precision(0.6)
  .rotate([0, 0, 11.5])

let path = geoPath()
  .projection(projection)

let graticule = geoGraticule()

function parseColors(s) {
  let m
  // TODO.  improve this function
  if(typeof s !== 'string') { return s }
  else if(m = /^(\w+)-(\d+)$/.exec(s)) {
    return schemes[ m[1] ][ +m[2] ] || s
  } else if(m = /^(\w+)$/.exec(s)) {
    return schemes[ m[1] ] || s
  } else {
    return s
  }
}

function validate(val, flows, stats) {
  let default_state = {
    rotate: [ 0.1278, -51.5074 ],  // London
    scale: 50,
    colors: schemes.schemeBlues[9]
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
    state.rotate[2] = 11.5 // default tilt
  }

  if(!(state.scale &&
       typeof state.scale === 'number'))
    throw "Globe state: cannot read scale from " + JSON.stringify(state)

  if(state.flows && !(flows[state.flows]))
    throw "Globe state: cannot identify flow diagram " + state.flows

/*
  if(state.choropleth && stats.indexOf(state.choropleth) === -1)
    throw "Globe state: cannot read choropleth column " + state.choropleth + " " + JSON.stringify(stats.columns)
*/

  if(state.colors && !(parseColors(state.colors)))
    throw "Globe state: cannot parse color descriptor " + state.colors

  return state
}

function update(canvas, layers, stats, flows, state) {
  let elem = canvas.node()
  let bounds = elem.getBoundingClientRect()

  let width = bounds.right - bounds.left
  let height = bounds.bottom - bounds.top

  state = validate(state, flows, stats)

  let color = d3.scaleLinear()

  let arcs = []

  if(state.choropleth) {
    let values = stats.map( (d) => project(d, state.choropleth))
    values.filter( (d) => d !== null )

    color = d3.scaleQuantile()
      .domain(values)
  }

  if(state.colors) {
    let vals = parseColors(state.colors)
    color.range(vals)
  }

  if(state.flows) {
    arcs = flows[state.flows]
  }

  d3.transition()
    .duration(1500)
    .tween('spin', () => {
      elem.__state = elem.__state || state

      projection.translate([width / 2, height / 2])

      let interp = d3.interpolate(elem.__state, state)
      let context = elem.getContext('2d')

      return (t) => {
        elem.__state = state = interp(t)
        projection.rotate(state.rotate)
          .scale(state.scale * Math.min(width, height) / 2)

        path.context(context)

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
    }).transition()
      .duration(2000)
      .tween('thematic', () => {
        // TODO.  thematic elements fade in afterward to globe animation fast
        //        is there another approach (dynamic simplification?)

        let context = elem.getContext('2d')

        return (t) => {
          // region choropleth
          if(state.choropleth) {
            context.save()
            layers.regions.features.forEach( (d) => {
              let value = project(stats[d.id], state.choropleth)
              // TODO.  fix GIS set to elide self-intersecting polygons
              if(!value || d.id > 1440) return
              let faded = d3.color( color(value) )
              faded.opacity = t
              context.fillStyle = faded + ""
              context.beginPath()
              path(d)
              context.fill()
            })
            context.restore()
          }

          // country borders (again)

          context.save()
          context.strokeStyle = 'white'
          context.lineWidth = 1
          context.beginPath()
          path( layers.countries )
          context.stroke()
          context.restore()

  /*
          // each arc in flow
          if(arcs) {
            context.save()
            context.lineWidth = 5
            context.lineCap = 'round'
            context.strokeStyle = 'lightblue'
            context.fillStyle = 'none'
            arcs.forEach( (d) => {
              return
              let a = stats[d.source], ac = [a.lon, a.lat]
              let b = stats[d.dest], bc = [b.lon, b.lat]

              // must use GeoJSON so that great arcs are curved according to projection
              context.beginPath()
              path({type: "LineString", coordinates: [ ac, bc ]})
              context.stroke()

              // no support for line endings in GeoJSON so do this in Canvas
              circle(context, path(ac), 10, 'white', 'lightblue')
              circle(context, path(bc), 10, 'lightblue', 'lightblue')
            })
            context.restore()
          }
      */
      }
    })
}

function circle(context, coords, radius, fill, stroke) {
  context.save()
  context.strokeStyle = stroke
  context.fillStyle = fill
  context.beginPath()
  context.arc(coords[0], coords[1], radius, 0, 2 * Math.PI, true)
  context.fill()
  context.stroke()
  context.restore()
}

function project(d, col) {
  return (d && col in d) ? d[col] : null
}

export { validate, update }
