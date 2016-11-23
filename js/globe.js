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

function validate(val, stats) {
  let default_state = {
    rotate: [ 0.1278, -51.5074 ],  // London
    scale: 50,
    colors: schemes.schemeBlues[9],
    layer: '.*'
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

  try {
    RegExp(state.layer)
  } catch(e) {
    throw "Globe state: cannot parse layer regexp from " + state.layer
  }

/*
  if(state.choropleth && stats.indexOf(state.choropleth) === -1)
    throw "Globe state: cannot read choropleth column " + state.choropleth + " " + JSON.stringify(stats.columns)
*/

  if(state.colors && !(parseColors(state.colors)))
    throw "Globe state: cannot parse color descriptor " + state.colors

  return state
}

function update(canvas, topography, stats, state) {
  let elem = canvas.node()
  let bounds = elem.getBoundingClientRect()

  let width = bounds.right - bounds.left
  let height = bounds.bottom - bounds.top

  state = validate(state, stats)

  let color = d3.scaleLinear()

  let layer_re = RegExp(state.layer)
  let layers = {}

  d3.keys(topography.objects).forEach( (key) => {
    if(layer_re.test(key)) {
      layers[key] = feature(topography, topography.objects[key]).features
    }
  })

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

        context.save()
        context.lineWidth = 1
        context.setLineDash([1, 3])
        context.strokeStyle = '#c9c4bc'
        context.beginPath()
        path( graticule() )
        context.stroke()
        context.restore()

        // each layer
        d3.keys(layers).forEach( (key) => {
          layers[key].forEach( (d,i) => {
            if(state.region_id && i !== state.region_id) return
            if(state.region_id) console.log([state.region_id, d])

            context.save()
//            context.lineWidth = 0.5
            context.strokeStyle = 'black'
//            context.fillStyle = d3.color(c).toString()

            context.fillStyle = 'lightcoral' //gradation(d.id)
            context.beginPath()
            path(d)
//            context.fill()
            context.stroke()
            context.restore()
          })
        })
        context.restore()
      }
    })
}

function project(d, col) {
  return (d && col in d) ? d[col] : null
}

export { validate, update }
