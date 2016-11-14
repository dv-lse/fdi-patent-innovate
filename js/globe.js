import * as d3 from 'd3'
import { geoPath, geoGraticule, geoOrthographic } from 'd3-geo'

let projection = geoOrthographic()
  .clipAngle(90)
  .precision(0.6)
  .rotate([0, 0, 11.5])

let path = geoPath()
  .projection(projection)

let graticule = geoGraticule()

function validate(val, colors) {
  let default_state = {
    rotate: [ 0.1278, -51.5074 ],  // London
    scale: 50,
    color: 'lightgray'
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

  if(!(state.choropleth in colors || d3.color(state.color)))
    throw "Globe state: cannot read color id " + (state.choropleth || state.color)

  return state
}

function update(canvas, countries, colors, state) {
  let elem = canvas.node()
  let bounds = elem.getBoundingClientRect()

  let width = bounds.right - bounds.left
  let height = bounds.bottom - bounds.top

  state = validate(state, colors)

  let color = colors[state.choropleth] || () => d3.color(state.color)

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

        context.save()
        context.lineWidth = 1
        context.strokeStyle = 'white'
        countries.forEach( (d) => {
          context.fillStyle = color(d.id)
          context.beginPath()
          path(d)
          context.fill()
          context.stroke()
        })
        context.restore()
      }
    })
}

export { validate, update }
