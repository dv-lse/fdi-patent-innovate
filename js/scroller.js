import * as d3 from 'd3'
import debounce from 'debounce'

function scroller(sel, callback) {
  // state

  let cur_index = null

  // install

  let sections = d3.selectAll('#narrative section')
  let sectionMidlines = calculate_midlines(sections)

  // navigation dots

  let nav = d3.select('#nav')

  if(nav.empty()) {
    nav = d3.select('body').append('div').attr('id', 'nav')
  }

  let dots = d3.range(0,sel.size())

  nav = nav.append('svg')
      .attr('width', 20)
      .attr('height', dots.length * 20)
    .selectAll('.dot')
    .data(dots)
    .enter().append('circle')
      .attr('class', 'dot')
      .attr('r', 7)
      .attr('cx', 10)
      .attr('cy', (d,i) => 10 + i * 20)
      .on('click', (d,i) => scroll_to(i))

  scrolled()
  fader()

  // install event handlers

  d3.select(window)
    .on('scroll.active', debounce(scrolled, 100))
    .on('scroll.fader', fader)
    .on('keydown', () => {
      let delta = 0
      switch (d3.event.keyCode) {
        case 39: // right arrow
//        case 40: // down arrow
        case 34: // page down
        delta = d3.event.metaKey ? Infinity : 1; break;
        case 37: // left arrow
//        case 38: // up arrow
        case 33: // page up
        delta = d3.event.metaKey ? -Infinity : -1; break;
        case 32: // space
        delta = d3.event.shiftKey ? -1 : 1;
        break;
        default: return;
      }
      d3.event.preventDefault()
      scroll_to(cur_index + delta)
    })

  function make_active(sectionIndex) {
    if(sectionIndex === cur_index) return
    cur_index = Math.max(0, Math.min(sel.size()-1, sectionIndex))

    sel.classed('active', (d,i) => i === sectionIndex)
      .transition()
      .duration(500)
        .style('border-color', (d,i) => i === sectionIndex ? 'darkgray' : 'white')
    nav.classed('active', (d,i) => i === sectionIndex)

    // update state and send any embedded message

    sel.each( function(d,i) {
      if(i !== cur_index) return

      let elem = d3.select(this)
        .select('script.message')
        .node()

      callback.apply(elem, [d,i])
    })
  }

  function scroll_to(sectionIndex) {
    sectionIndex = Math.max(0, Math.min(sectionMidlines.length-1, sectionIndex))

    let steps = Math.abs(cur_index - sectionIndex)
    let dur = 250 + Math.min(2000, steps * 250)

    d3.transition()
      .duration(dur)
      .tween('scroll', () => {
        let target = sectionMidlines[sectionIndex]
        let interp = d3.interpolateNumber(window.pageYOffset || 0, target)
        return (t) => window.scroll(0, interp(t))
      })
  }

  function scrolled() {
    let focus_pos = window.pageYOffset
    let distances = sectionMidlines.map( (v) => Math.abs(focus_pos - v) )
    let indices = d3.range(0,sectionMidlines.length)

    indices.sort((a,b) => distances[a] - distances[b])

    make_active(indices[0])
  }

  function fader() {
    let region = window.innerHeight / 7
    let opacity = d3.scaleLinear()
      .domain([region * 2.5, region * 1.5])
      .range([0.05, 1])
      .clamp(true)

    let focus_pos = window.pageYOffset
    let distances = sectionMidlines.map( (v) => Math.abs(focus_pos - v) )

    sel.style('opacity', (d,i) => opacity(distances[i]) )
  }

  function calculate_midlines(selection) {
    let startPos, midlines

    midlines = []
    selection.each(function(d,i) {
      let bbox = this.getBoundingClientRect()
      let middle = (bbox.top + bbox.bottom) / 2
      startPos = i ? startPos : middle
      midlines.push(Math.round(middle - startPos))
    })

    return midlines
  }
}

export { scroller as default }
