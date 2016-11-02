import * as d3 from 'd3'
import {queue} from 'd3-queue'

import markdown from 'markdown-it'
import yaml from 'js-yaml'

let md = markdown({
  html: false,
  linkify: true,
  typographer: true
})

md.core.ruler.push('section', (state) => {
  let tokens = []
  let level = 0

  openSection()

  for(let i=0; i<state.tokens.length; i++) {
    let token = state.tokens[i]
    if(token.markup === '---') {
      closeSection()
      openSection()
    } else {
      tokens.push(token)
    }
  }
  closeSection()

  state.tokens = tokens

  function openSection() {
    let token = new state.Token('section_open', 'section', level)
    token.block = true
    tokens.push(token)
    level++
  }

  function closeSection() {
    if(level > 0) {
      var t = new state.Token('section_close', 'section', level)
      t.block = true
      t.tag = '/section'
      tokens.push(t)
      level--
    }
  }
})


//
// extend markdown with macro to control visualisation
//

md.renderer.rules.visualisation = (tokens, idx, options, env) => {
  let payload = tokens[idx].content
  return '<div class="visualisation">' +
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

    let sectionPositions = []
    d3.selectAll('section')
      .each(function() {
        var top = this.getBoundingClientRect().top
        sectionPositions.push(top)
      })

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

    function makeactive(sectionIndex) {
      let sections = d3.selectAll('section')
        .classed('active', (d,i) => i === sectionIndex)
        .transition()
        .duration(500)
          .style('opacity', (d,i) => i === sectionIndex ? 1 : 0.1)

      d3.selectAll('section.active script')
        .each(function() {
          let payload = JSON.parse(this.text)
          visualise(payload)
        })
    }

    function scrolled(ev) {
      var pos = window.pageYOffset - 10
      var sectionIndex = d3.bisect(sectionPositions, pos)

      makeactive(sectionIndex)
    }
  })
