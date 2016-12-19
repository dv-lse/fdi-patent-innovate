import * as d3 from 'd3'

const margin = { top: 15, right: 40, bottom: 40, left: 15 }

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

  let duration = 5000
  let clock_radius = 15
  let clock_location = [ width - clock_radius * 5, height - clock_radius * 3 ]

  let years = d3.range(-9, 10)
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

  let max = d3.max(data, (d) => d.high)
  let min = d3.min(data, (d) => d.low)

  let x = d3.scaleLinear()
    .range([0,width])
    .domain(d3.extent(data, (d) => d.year))

  let y = d3.scaleLinear()
    .range([height, 0])
    .domain([min, max])

  let axis_y = d3.axisRight()
    .scale(y)

  let axis_x = d3.axisBottom()
    .scale(x)

  let area = d3.area()
    .x( (d) => x(d.year) )
    .y0( (d) => y(d.low) )
    .y1( (d) => y(d.high) )
    .curve(d3.curveCatmullRom)

  let line = d3.line()
    .x( (d) => x(d.year) )
    .y( (d) => y(d.value) )
    .curve(d3.curveCatmullRom)

  let trendLine = d3.line()
    .x( (d) => x(d.year) )
    .y( (d) => y(d.value) )
    .curve(d3.curveLinear)

  svg.html('<marker id="triangle"' +
            ' viewBox="0 0 10 10" refX="0" refY="5"' +
            ' markerUnits="strokeWidth"' +
            ' markerWidth="8" markerHeight="6"' +
            ' orient="auto">' +
            '<path d="M 0 0 L 10 5 L 0 10 z" fill="blue"/>' +
            '</marker>')

  svg = svg.append('g')
      .attr('transform', 'translate(' + [margin.left, margin.top] + ')')

  // error bars & baseline

  svg.append('path')
    .attr('d', area(data))
    .attr('fill', 'lightblue')

  svg.append('path')
    .attr('d', 'M' + x(0) + ' 0V' + height)
    .attr('stroke', 'red')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '5 2')

  svg.append('path')
    .attr('d', line(data))
    .attr('stroke-width', 1.5)
    .attr('fill', 'none')
    .attr('stroke', 'white')

  let trendData = data.filter( (d) => d.year == -9 || d.year == 0 || d.year == 9)
  let trendPath = svg.append('path')
    .attr('d', trendLine(trendData))
    .attr('stroke-width', 1.5)
    .attr('fill', 'none')
    .attr('stroke', 'blue')



  // axes

  svg.append('g')
    .attr('transform', 'translate(' + width + ')')
    .call(axis_y)
    .append('text')
      .attr('text-anchor', 'start')
      .attr('x', -height)
      .attr('dx', '5em')
      .attr('y', 6)
      .attr('dy', '-1em')
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'black')
      .text('difference in patenting, %')

    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(axis_x)

    // clockface

    let r = d3.scaleLinear()
      .range([-150, 150])
      .domain(d3.extent(years))

    let clock = svg.append('g')
      .attr('transform', 'translate(' + clock_location + ')')
    clock.append('circle')
      .attr('r', clock_radius)
      .attr('fill', 'none')
      .attr('stroke', 'gray')
      .attr('stroke-width', 2)
    clock.append('path')
      .attr('d', 'M0 0V' + -clock_radius)
      .attr('stroke', 'black')

    let clock_labels = svg.append('g')
      .attr('transform', 'translate(' + clock_location + ')')
      .attr('font-size', 10)
      .attr('font-family', 'sans-serif')
      .attr('text-anchor', 'middle')

    clock_labels.append('text')
      .attr('dy', -clock_radius - 5)
      .text('0')
    clock_labels.append('text')
      .attr('dy', clock_radius + 15)
      .text('years from intervention')

  // animation

  let total_length = trendPath.node().getTotalLength()
  trendPath.attr('stroke-dasharray', total_length + ' ' + total_length)
    .attr('stroke-dashoffset', total_length)
    .transition()
      .ease(d3.easeLinear)
      .duration(duration)
      .attr('stroke-dashoffset', 0)
    .on('end', function() {
      trendPath.attr('marker-end', 'url(#triangle)')
    })

  clock.transition()
    .ease(d3.easeLinear)
    .duration(duration)
    .attrTween('transform', function() {
      let i = d3.interpolate(-10, 10)
      return (t) => 'translate(' + clock_location + ')rotate(' + r(i(t)) + ')'
    })
}

export { validate, update }
