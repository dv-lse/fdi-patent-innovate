import * as d3 from 'd3'
import { geoPath, geoGraticule } from 'd3-geo'

function draw(context, projection, layers) {

  let path = geoPath()
    .projection(projection)
    .context(context)

  let graticule = geoGraticule()

  // Ocean background

  context.save()
  context.fillStyle = 'rgba(173,216,230,.4)'
  path({type:'Sphere'})
  context.fill()
  context.restore()

  // graticule

  context.save()
  context.lineWidth = .5
  context.strokeStyle = 'rgba(0,0,0,.2)'
  context.beginPath()
  path( graticule() )
  context.stroke()
  context.restore()

  // land

  context.save()
  context.fillStyle = 'darkgrey'
  context.beginPath()
  path( layers.land )
  context.fill()
  context.restore()

  // country borders

  context.save()
  context.strokeStyle = 'rgba(255,255,255,.5)'
  context.lineWidth = 1.5
  context.beginPath()
  path( layers.countries )
  context.stroke()
  context.restore()

  // region borders
  if(projection.scale() > 500) {
    context.save()
    context.strokeStyle = 'rgba(255,255,255,0.2)'
    context.lineWidth = 1
    context.beginPath()
    path( layers.regions )
    context.stroke()
  }
}

export { draw }
