import * as d3 from 'd3'
import { queue } from 'd3-queue'
import { feature, mesh } from 'topojson-client'
import markdown from 'markdown-it'

import front_matter from './js/md/front_matter'
import section from './js/md/section'
import message from './js/md/message'

import scroller from './js/scroller'
import * as globe from './js/globe'
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
    ['source_region_id_g', 'source_country_id_g', 'source_lat_def', 'source_long_def',
     /*'destination_region_id_g', */'destination_country_id_g', 'destination_lat_def', 'destination_long_def',
     'investment_mm', 'jobs', 'rank']))
  .defer(d3.csv, 'data/results.csv')
  .await( (err, narrative, world, rawstats, rawflows, results) => {
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

    d3.selectAll('#narrative a')
      .attr('target', '_blank')

    d3.selectAll('#narrative a[title]')
      .call(tooltip)

    d3.selectAll('section')
      .call(scroller, function() {
        let msg = ['visualisation', null, null]

        if(this) { msg = JSON.parse(this.text) }
        update(...msg)
      })

    // global event handlers

    function update(action, target, payload) {
      switch(action) {
        case 'visualisation': visualise(target, payload); break;
        default: throw 'Unknown message action: ' + action
      }
    }

    function visualise(target, state) {
      let viz = d3.select('#globe')
        .transition()
        .duration(500)
        .style('opacity', state ? 1 : 0.4)
      if(state) {
        viz.call(globe.update, layers, stats, flows, state)
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
