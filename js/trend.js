import * as d3 from 'd3'

const width = 500
const height = 400

const margin = { top: 15, right: 15, bottom: 40, left: 40 }

const duration = 5000
const clock_radius = 15
const clock_location = [ width - clock_radius * 3, height - clock_radius * 3 ]

const trend = (i) => Math.max(i * 0.5, 0)

const years = d3.range(-10, 11)

const data = years.map( (i) => {
  return {
    year: i,
    low: trend(i) - 0.5 - Math.random(),
    high: trend(i) + 0.5 + Math.random()
  }
})

const x = d3.scaleLinear()
  .range([0,width])
  .domain(d3.extent(data, (d) => d.year))

const y = d3.scaleLinear()
  .range([height, 0])
  .domain([-2.0,5.0])

let axis_y = d3.axisLeft()
  .scale(y)

let axis_x = d3.axisBottom()
  .scale(x)

let area = d3.area()
  .x( (d) => x(d.year) )
  .y0( (d) => y(d.low) )
  .y1( (d) => y(d.high) )
  .curve(d3.curveBasis)

let line = d3.line()
  .x( (year) => x(year) )
  .y( (year) => y(trend(year)) )

// prelude

let svg = d3.select('body')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

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

let trendPath = svg.append('path')
  .attr('d', line(years))
  .attr('stroke-width', 1.5)
  .attr('fill', 'none')
  .attr('stroke', 'blue')

// clockface

const r = d3.scaleLinear()
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


// axes

svg.append('g')
  .attr('transform', 'translate(0,' + height + ')')
  .call(axis_x)

svg.append('g')
  .call(axis_y)
  .append('text')
    .attr('text-anchor', 'end')
    .attr('y', 6)
    .attr('dy', '0.7em')
    .attr('transform', 'rotate(-90)')
    .attr('fill', 'black')
    .text('difference in patenting, %')

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
