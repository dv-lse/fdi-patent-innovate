import * as d3 from 'd3'
import * as schemes from 'd3-scale-chromatic'
import { feature } from 'topojson-client'
import { geoPath, geoGraticule, geoOrthographic, geoArea } from 'd3-geo'

const GLOBE_AREA = geoArea({type: 'Sphere'})

const LEGEND_MARGIN = 20
const LEGEND_HEIGHT = 15
const LEGEND_PADDING = [15, 5, 15, 5]

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
    colors: schemes.schemeBlues[9],
    format: '.1s'                  // One digit precision, with abbreviation
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

  if(state.choropleth && (! state.choropleth in stats[1])) {
    throw "Globe state: cannot read choropleth column " + state.choropleth + " " + JSON.stringify(stats.columns)
  }

  if(state.colors && !(parseColors(state.colors)))
    throw "Globe state: cannot parse color descriptor " + state.colors

  try {
    d3.format(state.format)
  } catch(e) {
    throw "Globe state: cannot parse format descriptor " + state.format
  }

  return state
}

function update(canvas, layers, stats, flows, state) {
  let elem = canvas.node()
  let bounds = elem.getBoundingClientRect()

  let width = bounds.right - bounds.left
  let height = bounds.bottom - bounds.top

  // validate application state / narrative

  state = validate(state, flows, stats)

  // install event handlers

  d3.select(elem).on('click.globe', function() {
    let pos = projection.invert(d3.mouse(this))
    console.log(pos)
    // TODO.  determine which region contains the point and show stats
  })

  // render the globe in new state

  let color = d3.scaleLinear()

  let arcs = []

  let omitted = d3.set()

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
      .on('end', () => {
        if(!omitted.empty()) {
          console.log('Omitted regions due to winding errors: ' + JSON.stringify(omitted.values()))
        }
      })
      .tween('thematic', () => {
        // TODO.  thematic elements fade in afterward to globe animation fast
        //        is there another approach (dynamic simplification?)

        let context = elem.getContext('2d')

        return (t) => {
          // region choropleth
          if(state.choropleth) {
            context.save()

            // regions

            layers.regions.features.forEach( (d) => {
              let value = project(stats[d.id], state.choropleth)
              if(!value) return

              let faded = d3.color( color(value) )
              faded.opacity = t
              context.fillStyle = faded + ""
              context.beginPath()
              if(geoArea(d) < GLOBE_AREA * .6)  {
                path(d)
                context.fill()
              } else {
                // Paths with large area generally have winding artefacts,
                // and cannot be filled in Canvas.  Record for an error.
                omitted.add(d.id)
              }
            })

            // country borders (again)

            context.save()
            context.strokeStyle = 'white'
            context.lineWidth = 1
            context.beginPath()
            path( layers.countries )
            context.stroke()
            context.restore()

            // legend

            let faded_black = d3.color('black')
            faded_black.opacity = t
            faded_black = faded_black + ''

            var fmt = state.format ? d3.format(state.format) : d3.format('2s')

            var x = d3.scaleBand()
              .rangeRound([width * .5, width - LEGEND_MARGIN])
              .domain(color.range())

            context.fillStyle = 'rgba(255,255,255,.85)'
            context.fillRect(x.range()[0] - LEGEND_PADDING[3],
                             LEGEND_MARGIN - LEGEND_PADDING[0],
                             x.range()[1] - x.range()[0] + LEGEND_PADDING[1] + LEGEND_PADDING[3],
                             LEGEND_PADDING[0] + LEGEND_HEIGHT + LEGEND_PADDING[2])

            if(state.label) {
              context.fillStyle = faded_black
              context.textBaseline = 'alphabetic'
              context.textAlign = 'left'
              context.fillText(state.label, x.range()[0], LEGEND_MARGIN - 2)
            }

            color.range().map( (c,i) => {
              let q = color.invertExtent(c)
              let low = q[0] || color.domain()[0]
              let high = q[1] || color.domain()[1]

              let faded_color = d3.color(c)
              faded_color.opacity = t
              context.fillStyle = faded_color + ""

              context.fillRect(x(c), LEGEND_MARGIN, x.bandwidth(), LEGEND_HEIGHT)
              context.fillStyle = faded_black
              context.textBaseline = 'hanging'
              context.textAlign = 'right'

              let label = (i === 0) ? '≤ ' + fmt(high) : fmt(high)
              context.fillText(label, x(c) + x.bandwidth(), LEGEND_MARGIN + LEGEND_HEIGHT + 2)
            })

            context.restore()
          }

          // each arc in flow
          if(arcs) {
            context.save()
            context.lineWidth = 5
            context.lineCap = 'round'
            context.strokeStyle = 'lightblue'
            context.fillStyle = 'none'
            arcs.forEach( (d) => {
              let a = stats[d.source], ac = [d.source_long_def, d.source_lat_def]
              let b = stats[d.dest], bc = [d.destination_long_def, d.destination_lat_def]

              // must use GeoJSON so that great arcs are curved according to projection
              context.beginPath()
              path({type: "LineString", coordinates: [ ac, bc ]})
              context.stroke()

              // no support for line endings in GeoJSON so do this in Canvas
              circle(context, projection(ac), 10, 'white', 'lightblue')
              circle(context, projection(bc), 10, 'lightblue', 'lightblue')
            })
            context.restore()
          }
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
