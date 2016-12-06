import * as d3 from 'd3'
import { queue } from 'd3-queue'
import { feature} from 'topojson-client'
import debounce from 'debounce'
import markdown from 'markdown-it'

import { geoCentroid } from 'd3-geo'

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
  .defer(d3.json, 'data/topography.json')
  .defer(d3.csv, 'data/regions_countries.csv', lift(Number))
  .defer(d3.csv, 'data/flows.csv', lift(Number, ['source', 'dest', 'weight']))
//  .defer(d3.csv, 'data/centroids.csv', lift(Number))
  .await( (err, narrative, world, rawstats, rawflows) => {
    if (err) return console.error(err)

    // data post-processing: note centroids are computed and injected into stats
    let stats = Array()
    rawstats.forEach( (d) => stats[d.geoid_r] = d)

    let centroids = Array()
    let geo = feature(world, world.objects)
    console.log(geo)

    d3.values(world.objects).forEach( (d) => {
      let geo = feature(world, d)
      centroids[d.id] = center(d)

      console.log(geo)
    })



    d3.keys(world.objects).forEach( (key) => {
      console.log(key)
      let geojson = feature(world, world.objects[key]).features

      console.log(geojson)


      layers[key].forEach( (d) => {
      })
    })

    console.log(JSON.stringify(centroids))

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

function center(feature) {
  let match = feature
  let area = -1
  if(feature.geometry.type === 'MultiPolygon') {
    feature.geometry.coordinates.forEach( (coords) => {
      let t = { type: 'Polygon', coordinates: coords }
      let a = d3.geoArea(t)
      if (a > area) { area = a; match = t }
    })
  }
  return d3.geoCentroid(match)
}
