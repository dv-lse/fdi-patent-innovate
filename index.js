import * as d3 from 'd3'
import { queue } from 'd3-queue'
import { feature, mesh } from 'topojson-client'
import markdown from 'markdown-it'
import debounce from 'debounce'

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

    let symbols = feature(world, world.objects.regions)
    symbols.features.forEach( (f) => {
      f.geometry = { type: 'Point', coordinates: d3.geoCentroid(f) }
    })

    let layers = {
      land: feature(world, world.objects.land),
      countries: mesh(world, world.objects.countries, (a,b) => a !== b),
      regions: mesh(world, world.objects.regions, (a,b) => a !== b),
      symbols: symbols
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

    let results_datacols = rawresults.columns.filter( (c) => trend.attributes.indexOf(c) == -1 )
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
      .call(scroller, dispatch)

    function dispatch() {
      let msg = ['visualisation', null, null]
      if(this) { msg = JSON.parse(this.text) }
      update(...msg)
    }

    d3.select('#trend')
      .call(trend.install, results)

    // responsive layout

    window.onresize = debounce(resize, 300)

    resize()

    function resize() {
      let window_w = window.innerWidth
      let window_h = window.innerHeight

      let banner_h = d3.select('#narrative header').node().getBoundingClientRect().height
      let trend_l = d3.select('#trend').node().getBoundingClientRect().left

      let plot_h = window_h - banner_h
      let plot_w = window_w - trend_l

      let focus_line = (window_h + banner_h) / 2

      d3.select('#globe')
        .attr('width', window_w)
        .attr('height', plot_h)

      d3.select('#trend')
        .attr('width', plot_w)
        .attr('height', plot_h)

      d3.select('#narrative')
        .style('margin-top', focus_line + 'px')

      // TODO.  more elegant way to find current payload?
      d3.select('#narrative section.active script.message')
        .each(function() {
          let elem = d3.select(this).node()
          dispatch.apply(elem)
        })
    }

    // global message handlers

    function update(action, target, payload) {
      switch(action) {
        case 'visualisation': visualise(target, payload); break;
        default: throw 'Unknown message action: ' + action
      }
    }

    function visualise(target, state) {
      d3.selectAll('.layer')
        .style('visibility', function() {
          let id = d3.select(this).attr('id')
          return id === target ? 'visible' : 'hidden'
        })

      d3.select('#zoom')
        .style('visibility', 'hidden')

      switch(target) {
        case 'globe': d3.select('#globe').call(globe.update, layers, stats, flows, state);
                      d3.select('#zoom').style('visibility', 'visible');
                      break;
        case 'trend': d3.select('#trend').call(trend.update, results, state);
                      break;
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
