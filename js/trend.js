import * as d3 from 'd3'
import { least_squares } from './util/regression'

const margin = { top: 40, right: 60, bottom: 60, left: 0 }

function validate(val, results) {
  let default_state = {
    category: 'All technologies',
    region: 'All regions'
  }

  let state = Object.assign({}, default_state, val)

  let categories = d3.set()
  let regions = d3.set()
  results.forEach( (d) => {
    categories.add(d.cat)
    regions.add(d.region)
  })

  if(!(categories.has(state.category)))
    throw "Trend state: cannot read category from " + JSON.stringify(state)
  if(!(regions.has(state.region)))
    throw "Trend state: cannot read region from " + JSON.stringify(state)

  return state
}

function update(svg, results, state) {

  state = validate(state, results)

  let width = svg.attr('width') - margin.left - margin.right
  let height = svg.attr('height') - margin.top - margin.bottom

  // determine available test years

  let columns = d3.keys(results[0])
  let years = columns.map( (k) => {
      let m = k.match(/t(_?\d+)/)
      if(!m) return null
      return +(m[1].replace('_', '-'))
    })
    .filter( (d) => d )
    .sort(d3.ascending)

  // reformat data frame by test year

  let record = results.filter( (d) => d.cat === state.category && d.region === state.region )[0]
  let data = years.map( (i) => {
    let key = ('' + i).replace('-', '_')
    return {
      year: i,
      high: record['err' + key + '_up'],
      value: record['t' + key],
      low: record['err' + key + '_down']
    }
  })

  // calculate the pre- and post-intervention trend lines

  let lr = least_squares()
    .x( (d) => d.year)
    .y( (d) => d.value)
  let left = lr(data.filter( (d) => d.year <= 0 ))
  let right = lr(data.filter( (d) => d.year >= 0 ))

  // some basic stats

  let max = d3.max(data, (d) => d.high)
  let min = d3.min(data, (d) => d.low)

  // prepare for visualisation

  let x = d3.scaleLinear()
    .range([0,width])
    .domain(d3.extent(years))

  let y = d3.scaleLinear()
    .range([height, 0])
    .domain([min, max])

  let axis_y = d3.axisRight()
    .scale(y)

  let axis_x = d3.axisBottom()
    .scale(x)
    .tickFormat( (d) => d===0 ? 'year 0' : d)

  let area = d3.area()
    .x( (d) => x(d.year) )
    .y0( (d) => y(d.low) )
    .y1( (d) => y(d.high) )
    .curve(d3.curveCatmullRom)

  let line = d3.line()
    .x( (d) => x(d.year) )
    .y( (d) => y(d.value) )
    .curve(d3.curveCatmullRom)

  let trendArrow = (fn) => d3.line()
    .x( (year) => x(year) )
    .y( (year) => y(fn(year)) )
    .curve(d3.curveLinear)

  // emit SVG header material and legend

  svg.html(triangle_marker('triangle-black', 'black')
         + triangle_marker('triangle-blue', 'blue'))

  svg = svg.append('g')
      .attr('transform', 'translate(' + [margin.left, margin.top] + ')')

  svg.append('text')
     .attr('font-size', '12pt')
     .selectAll('tspan')
     .data(['Patenting rates:', 'regions with', 'economic intervention'])
    .enter().append('tspan')
      .attr('x', 0)
      .attr('y', height / 3)
      .attr('dy', (d,i) => (i * 1.2) + 'em')
      .text((d) => d)

  // error bars

  svg.append('path')
    .attr('d', area(data))
    .attr('fill', 'lightblue')

  // intervention marker
  svg.append('path')
    .attr('d', 'M' + x(0) + ' 0V' + height)
    .attr('stroke', 'red')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '5 2')

  // baseline & label
  svg.append('path')
    .attr('d', 'M0 ' + y(0) + 'H' + (width - 10))
    .attr('stroke', 'black')
    .attr('stroke-width', 1.5)
    .attr('marker-end', 'url(#triangle-black)')

  svg.append('text')
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .attr('font-size', 10)
    .attr('x', x(2))
    .attr('y', y(0))
    .attr('dy', '-.3em')
    .text('regions without intervention')

  // median difference line
  svg.append('path')
    .attr('d', line(data))
    .attr('stroke-width', .33)
    .attr('fill', 'none')
    .attr('stroke', 'white')

  // trend arrows

  let left_arrow_years = d3.range(years[1], 0)
  svg.append('path')
    .attr('d', trendArrow(left)(left_arrow_years))
    .attr('stroke-width', 1.5)
    .attr('fill', 'none')
    .attr('stroke', 'blue')
    .attr('marker-end', 'url(#triangle-blue)')

  let right_arrow_years = d3.range(1, years[years.length-2])
  svg.append('path')
    .attr('d', trendArrow(right)(right_arrow_years))
    .attr('stroke-width', 1.5)
    .attr('fill', 'none')
    .attr('stroke', 'blue')
    .attr('marker-end', 'url(#triangle-blue)')

  // axes

  svg.append('g')
    .attr('transform', 'translate(' + width + ')')
    .call(axis_y)
    .append('text')
      .attr('text-anchor', 'start')
      .attr('x', -y(0))
      .attr('dx', 50)
      .attr('y', 6)
      .attr('dy', '-1em')
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'black')
      .text('difference from baseline, %')

    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(axis_x)
}

function triangle_marker(id, color) {
  color = color || 'black'
  return '<marker id="' + id + '"' +
            ' viewBox="0 0 10 10" refX="0" refY="5"' +
            ' markerUnits="strokeWidth"' +
            ' markerWidth="8" markerHeight="6"' +
            ' orient="auto">' +
            '<path d="M 0 0 L 10 5 L 0 10 z" fill="' + color + '"/>' +
            '</marker>'
}

export { validate, update }
