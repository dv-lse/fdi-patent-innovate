import * as d3 from 'd3'
import {queue} from 'd3-queue'

import markdown from 'markdown-it'
import yaml from 'js-yaml'

let md = markdown({
  html: false,
  linkify: true,
  typographer: true
})




//
// extend markdown with macro to control visualisation
//

md.renderer.rules.visualisation = (tokens, idx, options, env) => {
  let payload = tokens[idx].content
  return '<div class="visualisation">' +
         (payload.label ? '<span class="label">' + payload.label + '</span>' : '') +
         '<script type="application/json">' +
         JSON.stringify(payload) +
         '</script></div>'
}

md.block.ruler.before('fence', 'visualisation', (state, startLine, endLine, silent) => {

  let marker, mem, len, markup, params, nextLine, token, content, message

  let pos = state.bMarks[startLine] + state.tShift[startLine]
  let max = state.eMarks[startLine]

  if (pos + 3 > max) { return false }
  marker = state.src.charCodeAt(pos)

  if(marker != 58 /* ':' */) { return false }

  mem = pos
  pos = state.skipChars(pos, marker)
  len = pos - mem

  if (len < 3) { return false }

  markup = state.src.slice(mem, pos)
  params = state.src.slice(pos, max)

  if (silent) { return true }

  nextLine = startLine
  while(true) {
    nextLine++
    if(nextLine >= endLine) break
    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine]
    max = state.eMarks[nextLine]
    if (state.src.charCodeAt(pos) !== marker) { continue }
    if (state.sCount[nextLine] - state.blkIndent >= 4) { continue }
    pos = state.skipChars(pos, marker)
    if (pos - mem < len) { continue }
    pos = state.skipSpaces(pos)
    if (pos < max) { continue }
    break;
  }

  len = state.sCount[startLine]

  state.line = nextLine + 1

  try {
    content       = state.getLines(startLine + 1, nextLine, len, true)
    message       = yaml.safeLoad(content)
  } catch(ex) {
    message       = ex.message + '\n' + content
  }

  token         = state.push('visualisation', 'script', 0)
  token.info    = params
  token.content = message
  token.markup  = markup
  token.map     = [ startLine, state.line ]

  return true
})

//
// load data & render
//

const width = 550
const height = 450
const margin = { left: 10, top: 10, right: 10, bottom: 10 }

queue()
  .defer(d3.text, 'narrative.md')
  .await( (err, narrative) => {
    d3.select('#narrative')
      .html(md.render(narrative))
    let svg = d3.select('#viz')
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + [margin.left, margin.top] + ')')

    let circle = svg.append('circle')

    visualise({radius: 2, color: 'green', amount: .2})

    window.onscroll = scrolled

    function offset(elem) {
      return Math.abs(elem.getBoundingClientRect().top)
    }

    function visualise(state) {
      circle.transition()
        .duration(500)
        .attr('transform', 'translate(' + [state.amount * width, state.amount * height] + ')')
        .attr('r', state.radius)
        .attr('fill', state.color)
    }

    function makeactive(active) {
      d3.select('.visualisation')
        .classed('active', false)

      let elem = d3.select(active)
        .classed('active', true)

      let raw = elem.select('script').node().text
      let payload = JSON.parse(raw)

      visualise(payload)
    }

    function scrolled(ev) {
      let active = null

      d3.selectAll('.visualisation')
        .each( function() {
          if(!active || offset(this) < offset(active)) { active = this }
        })

      makeactive(active)
    }

  })
