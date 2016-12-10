import * as d3 from 'd3'
import { queue } from 'd3-queue'
import { feature, mesh } from 'topojson-client'
import debounce from 'debounce'
import markdown from 'markdown-it'

import front_matter from './js/md/front_matter'
import section from './js/md/section'
import visualisation from './js/md/visualisation'

import * as globe from './js/globe'
import { enforce_rhr } from './js/winding'


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
  .defer(d3.json, 'data/topography.json')
  .defer(d3.csv, 'data/regions_countries.csv', lift(Number))
  .defer(d3.csv, 'data/flows.csv', lift(Number, ['source', 'dest', 'weight']))
  .await( (err, narrative, world, rawstats, rawflows) => {
    if (err) return console.error(err)

    // data post-processing

    let layers = {
      land: feature(world, world.objects.land),
      countries: mesh(world, world.objects.countries, (a,b) => a !== b),
      regions: feature(world, world.objects.regions)
    }

    // workaround: topojson-simplify 2.0.0 occasionally inverts winding order,
    //   which means features cannot be filled on Canvas

    //      topojson-simplify -F eliminates most of these artefacts

    // layers.regions.features.forEach(enforce_rhr)

    let stats = Array()
    rawstats.forEach( (d) => stats[d.geoid_r] = d)

    let flows = d3.nest()
      .key( (d) => d.group )
      .object( rawflows )

    // render narrative html

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
          .call(globe.update, layers, stats, flows, state)
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

      let state = payload()
      visualise(state)

      cur_index = sectionIndex
    }

    function payload() {
      let payload = null
      let viz = d3.selectAll('section.active script')
        .each(function() {
          payload = payload || JSON.parse(this.text)
        })
      return payload
    }

    function scrolled(ev) {
      var pos = window.pageYOffset + 150
      var sectionIndex = d3.bisect(sectionPositions, pos)
      sectionIndex = Math.max(0, Math.min(sectionIndex, sectionPositions.length-1))
      makeactive(sectionIndex)
    }
  })


// utility

function lift(fn, keys) {
  return (o) => {
    (keys || d3.keys(o)).forEach( (key) => o[key] = fn(o[key]))
    return o
  }
}
