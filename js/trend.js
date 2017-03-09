import * as d3 from 'd3'
import { least_squares } from './util/regression'

const margin = { top: 40, right: 60, bottom: 60, left: 0 }
const attributes = ['region', 'category', 'firms']


function matches(state, results) {
  return results.filter((r) => attributes.every((ra) => r[ra] === state[ra] || !(ra in state)))
}

function validate(val, results) {
  let default_state = {
    category: 'All technologies',
    region: 'All regions',
    firms: 'All firms',
    explore: false
  }

  let state = Object.assign({}, default_state, val)

  if(matches(state, results).length < 1)
    throw "Trend results: cannot match " + JSON.stringify(state)

  return state
}

function install(svg, results) {

  let width = svg.attr('width') - margin.left - margin.right
  let height = svg.attr('height') - margin.top - margin.bottom

  // emit SVG header material and legend

  svg.html(triangle_marker('triangle-black', 'black')
         + triangle_marker('triangle-blue', 'blue'))

  svg = svg.append('g')
    .attr('id', 'panel')
    .attr('transform', 'translate(' + [margin.left, margin.top] + ')')

  svg.append('text')
     .attr('font-size', '12pt')
     .selectAll('tspan')
     .data(['Patenting rates:', 'regions with', 'economic intervention'])
    .enter().append('tspan')
      .attr('x', 0)
      .attr('y', 20)
      .attr('dy', (d,i) => (i * 1.2) + 'em')
      .text((d) => d)

    svg.append('path')
      .attr('class', 'area')
      .attr('fill', 'lightblue')

    // intervention marker
    svg.append('path')
      .attr('class', 'intervention')
      .attr('stroke', 'red')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5 2')

    // baseline & labels
    // TODO.  would be better not to approximate y translate here
    let baseline = svg.append('g')
      .attr('class', 'baseline')
      .attr('transform', 'translate(0,' + (height * 9 / 10) + ')')

    baseline.append('path')
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#triangle-black)')

    baseline.append('text')
      .attr('class', 'baseline_label')
      .attr('text-anchor', 'start')
      .attr('fill', 'black')
      .attr('font-size', 10)
      .attr('dy', '-.3em')
      .text('regions without intervention')

    baseline.append('text')
      .attr('class', 'y_label')
      .attr('text-anchor', 'start')
      .attr('dy', '-.7em')
      .attr('dx', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'black')
      .attr('font-size', 10)
      .text('difference from baseline, %')

    // median difference line
    svg.append('path')
      .attr('class', 'median_difference')
      .attr('stroke-width', .33)
      .attr('fill', 'none')
      .attr('stroke', 'white')

    svg.append('path')
      .attr('class', 'left_arrow')
      .attr('stroke-width', 1.5)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('marker-end', 'url(#triangle-blue)')

    svg.append('path')
      .attr('class', 'right_arrow')
      .attr('stroke-width', 1.5)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('marker-end', 'url(#triangle-blue)')

    // axes

    svg.append('g')
      .attr('class', 'axis y')

    svg.append('g')
      .attr('class', 'axis x')

    let selectors = svg.append('g')
      .attr('class', 'selectors')
      .attr('transform', 'translate(0,120)')

    let group = selectors.selectAll('g')
      .data(attributes)
      .enter().append('g')
        .attr('class', (d) => d)
        .attr('transform', (d,i) => 'translate(' + (i % 2 * 120) + ',' + (Math.floor(i / 2) * 120) + ')')

    let item = group.selectAll('text')
      .data( (d) => d3.set(results, (r) => r[d]).values().sort(d3.ascending) )
      .enter().append('text')
        .attr('class', (d) => downcase(d))
        .attr('y', (d,i) => (i * 1.3) + 'em')
        .text( (d) => d )

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
    .filter((d) => d)
    .sort(d3.ascending)

  // reformat data frame by test year

  let record = matches(state, results)[0]
  let data = years.map( (i) => {
    let key = ('' + i).replace('-', '_')
    return {
      year: i,
      high: record ? record['err' + key + '_up'] : 0,
      value: record ? record['t' + key] : 0,
      low: record ? record['err' + key + '_down'] : 0
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

  // selectors

  let selectors = svg.select('.selectors')
    .attr('visibility', state.explore ? '' : 'hidden')

  let attributes = ['region', 'category', 'firms']

  attributes.forEach( (key) => {
    // TODO.  use matches function here?
    let context_results = results.filter((r) => attributes.every((ra) => ra == key || r[ra] == state[ra]))
    let context = d3.set(context_results, (r) => r[key])

    selectors.selectAll('g.' + key + ' text')
      .classed('selected', (d) => d === state[key])
      .classed('active', (d) => context.has(d))
      .on('click', (d) => {
        if(!context.has(d)) return
        state[key] = d
        update(svg, results, state)
      })
  })

  // intervention marker
  svg.select('.intervention')
    .attr('d', 'M' + x(0) + ' 0V' + height)

  // error bars

  let t0 = svg.transition()
    .duration(1250)

  t0.select('.area')
    .attr('d', area(data))

  // median difference line
  t0.select('.median_difference')
    .attr('d', line(data))

  // baseline & label
  svg.select('.baseline path')
    .attr('d', 'M0 0H' + (width - 10))

  svg.select('.baseline .baseline_label')
    .attr('x', x(2))

  svg.select('.baseline .y_label')
    .attr('y', width)

  t0.select('.baseline')
    .attr('transform', 'translate(0,' + y(0) + ')')

  // trend arrows

  let left_arrow_years = d3.range(years[1], 0)
  t0.select('.left_arrow')
    .attr('d', trendArrow(left)(left_arrow_years))

  let right_arrow_years = d3.range(1, years[years.length-1])
  t0.select('.right_arrow')
    .attr('d', trendArrow(right)(right_arrow_years))

  // axes
  svg.select('.axis.y')
    .attr('transform', 'translate(' + width + ')')
  t0.select('.axis.y')
    .call(axis_y)

  svg.select('.axis.x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(axis_x)
}

function downcase(s) {
  return s.toLowerCase().replace(/\W/g, '_')
}

export { install, validate, update, attributes }
