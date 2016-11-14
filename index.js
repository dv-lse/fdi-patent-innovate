import * as d3 from 'd3'
import * as schemes from 'd3-scale-chromatic'
import { queue } from 'd3-queue'
import { feature} from 'topojson-client'
import debounce from 'debounce'
import markdown from 'markdown-it'

import front_matter from './js/md/front_matter'
import section from './js/md/section'
import visualisation from './js/md/visualisation'

import * as globe from './js/globe'


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

queue()
  .defer(d3.text, 'data/narrative.md')
  .defer(d3.json, 'data/110m.json')
  .defer(d3.tsv, 'data/110m.tsv')
  .await( (err, narrative, world, stats) => {
    if (err) return console.error(err)

    let gdp_md_est = {}
    let pop_est = {}

    stats.forEach( (d,i) => {
      gdp_md_est[d.iso_n3] = +d.gdp_md_est
      pop_est[d.iso_n3] = +d.pop_est
    })

    let gdp_scale = d3.scaleQuantile()
      .domain(d3.values(gdp_md_est))
      .range(schemes.schemeBlues[9])

    let population_scale = d3.scaleQuantile()
      .domain(d3.values(pop_est))
      .range(schemes.schemeReds[9])

    // TBD
    let education_scale = d3.scaleQuantile()
      .domain(d3.values(pop_est))
      .range(schemes.schemePiYG[9])

    let colors = {
      gdp: (id) => gdp_scale(gdp_md_est[id]),
      population: (id) => population_scale(pop_est[id]),
      education: (id) => education_scale(pop_est[id]),
      default: () => () => 'lightcoral'
    }

    let countries = feature(world, world.objects.countries).features

    d3.select('#narrative')
      .html(md.render(narrative))

    let sectionPositions = []
    d3.selectAll('section')
      .each(function(d,i) {
        var triggerPos = this.getBoundingClientRect().bottom
        sectionPositions.push(triggerPos)
      })

    let nav = d3.select('#nav')
      .append('svg')
        .attr('width', 20)
        .attr('height', sectionPositions.length * 20)
      .selectAll('.dot')
      .data(sectionPositions)
      .enter().append('circle')
        .attr('class', 'dot')
        .attr('r', 5)
        .attr('cx', 10)
        .attr('cy', (d,i) => 10 + i * 20)
        .on('click', (d,i) => {
          d3.transition()
            .duration(750)
            .tween('scroll', () => {
              let target = sectionPositions[i-1] || 0
              let interp = d3.interpolateNumber(window.pageYOffset || 0, target)
              return (t) => window.scroll(0, interp(t))
            })
          })

    makeactive(0)

    window.onscroll = debounce(scrolled, 100)

    function offset(elem) {
      return Math.abs(elem.getBoundingClientRect().top)
    }

    function visualise(state) {
      console.log("Visualising: " + JSON.stringify(state))
      let viz = d3.select('#viz')
      if(state) {
        viz.transition()
          .duration(500)
          .style('opacity', 1)
          .call(globe.update, countries, colors, state)
      } else {
        viz.transition()
          .duration(500)
          .style('opacity', 0.4)
      }
    }

    let cur_index = null
    function makeactive(sectionIndex) {
      if(sectionIndex === cur_index) return

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

      cur_index = sectionIndex
    }

    function scrolled(ev) {
      var pos = window.pageYOffset + 150
      var sectionIndex = d3.bisect(sectionPositions, pos)
      sectionIndex = Math.max(0, Math.min(sectionIndex, sectionPositions.length-1))
      makeactive(sectionIndex)
    }
  })
