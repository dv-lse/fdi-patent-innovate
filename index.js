import * as d3 from 'd3'
import { queue } from 'd3-queue'
import { feature, mesh } from 'topojson-client'
import markdown from 'markdown-it'

import front_matter from './js/md/front_matter'
import section from './js/md/section'
import message from './js/md/message'

import scroller from './js/scroller'
import * as globe from './js/globe'
import * as trend from './js/trend'

import tooltip from './js/tooltip'
// import { enforce_rhr } from './js/util/winding'


let md = markdown({
    html: false,
    linkify: true,
    typographer: true })
  .use(front_matter)
  .use(section)
  .use(message)

//
// load data & render
//

queue()
  .defer(d3.text, 'data/narrative.md')
  .defer(d3.json, 'data/topography.json')
  .defer(d3.csv, 'data/regions_countries.csv', lift(Number))
  .defer(d3.csv, 'data/flows.csv', lift(Number,
    ['source_lat_def', 'source_long_def',
     'destination_lat_def', 'destination_long_def',
     'investment_mm', 'jobs', 'rank']))
  .defer(d3.csv, 'data/results.csv')
  .await( (err, narrative, world, rawstats, rawflows, rawresults) => {
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

    let results_datacols = rawresults.columns.filter( (c) => {
      return c !== 'region' && c !== 'cat'
    })
    let results = rawresults.map(lift(Number, results_datacols))

    // render narrative html

    d3.select('#narrative')
      .html(md.render(narrative))

    // upgrade link tooltips

    d3.selectAll('#narrative a')
      .attr('target', '_blank')

    d3.selectAll('#narrative a[title]')
      .call(tooltip)

    // turn sections into a scroller narrative

    d3.selectAll('section')
      .call(scroller, function() {
        let msg = ['visualisation', null, null]

        if(this) { msg = JSON.parse(this.text) }
        update(...msg)
      })

    // global message handlers

    function update(action, target, payload) {
      switch(action) {
        case 'visualisation': visualise(target, payload); break;
        default: throw 'Unknown message action: ' + action
      }
    }

    function visualise(target, state) {
      let trans = d3.transition()
        .duration(500)

      trans.selectAll('.layer')
        .style('opacity', function() {
          let id = d3.select(this).attr('id')
          return id === target ? 1 : 0
        })

      switch(target) {
        case 'globe': d3.select('#globe').call(globe.update, layers, stats, flows, state); break;
        case 'trend': d3.select('#trend').call(trend.update, results, state); break;
        case null: break;
        default: throw 'Unkown visualisation ' + target
      }
    }
  })


// utility

function lift(fn, keys) {
  return (o) => {
    (keys || d3.keys(o)).forEach( (key) => o[key] = fn(o[key]))
    return o
  }
}
