import * as d3 from 'd3'
import {queue} from 'd3-queue'
import debounce from 'debounce'
import markdown from 'markdown-it'

import front_matter from './js/md/front_matter'
import section from './js/md/section'
import visualisation from './js/md/visualisation'

let md = markdown({
    html: false,
    linkify: true,
    typographer: true })
  .use(front_matter)
  .use(section)
  .use(visualisation)

//
// load data & render
//

const width = 550
const height = 450
const margin = { left: 10, top: 10, right: 10, bottom: 10 }

queue()
  .defer(d3.text, 'data/narrative.md')
  .await( (err, narrative) => {
    d3.select('#narrative')
      .html(md.render(narrative))

    let sectionPositions = []
    d3.selectAll('section')
      .each(function(d,i) {
        var startPos = this.getBoundingClientRect().top
        if(i === 0) { startPos = 0 }
        sectionPositions.push(startPos)
      })

    let svg = d3.select('#viz')
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + [margin.left, margin.top] + ')')

    let nav = svg.append('g')
      .attr('id', 'nav')
      .attr('transform', 'translate(0,150)')
      .selectAll('circle')
    .data(sectionPositions)
      .enter().append('circle')
        .attr('r', 5)
        .attr('cy', (d,i) => i * 20)
        .on('click', (d,i) => {
          d3.transition()
            .duration(750)
            .tween("scroll", () => {
              let int = d3.interpolateNumber(window.pageYOffset || 0, sectionPositions[i] - 100)
              return (t) => window.scroll(0, int(t))
            })
          })

    let circle = svg.append('circle')

    makeactive(0)

    window.onscroll = debounce(scrolled, 100)

    function offset(elem) {
      return Math.abs(elem.getBoundingClientRect().top)
    }

    function visualise(state) {
      if(state) {
        circle.transition()
          .duration(500)
          .attr('opacity', 1)
          .attr('transform', 'translate(' + [state.amount * width, state.amount * height] + ')')
          .attr('r', state.radius)
          .attr('fill', state.color)
      } else {
        circle.transition()
        .duration(500)
        .attr('opacity', 0.05)
      }
    }

    function makeactive(sectionIndex) {
      let sections = d3.selectAll('section')
        .classed('active', (d,i) => i === sectionIndex)
        .transition()
        .duration(500)
          .style('opacity', (d,i) => i === sectionIndex ? 1 : 0.1)

      nav.classed('active', (d,i) => i === sectionIndex)

      let viz = d3.selectAll('section.active script')
        .each(function() {
          let payload = JSON.parse(this.text)
          visualise(payload)
        })

      if(viz.size() === 0) {
        visualise(null)
      }
    }

    function scrolled(ev) {
      var pos = window.pageYOffset - 10
      var sectionIndex = d3.bisect(sectionPositions, pos)
      sectionIndex = Math.min(sectionIndex, sectionPositions.length-1)
      makeactive(sectionIndex)
    }
  })
