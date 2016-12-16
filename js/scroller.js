import * as d3 from 'd3'
import debounce from 'debounce'

function scroller(sel, callback) {
  // state

  let cur_index = null

  // install

  let sectionPositions = []
  sel.each(function(d,i) {
    var triggerPos = this.getBoundingClientRect().bottom
    sectionPositions.push(triggerPos)
  })

  // navigation dots

  let nav = d3.select('#nav')

  if(nav.empty()) {
    nav = d3.select('body').append('div').attr('id', 'nav')
  }

  nav = nav.append('svg')
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

  make_active(0)

  // install event handlers

  window.onscroll = debounce(scrolled, 100)

  function offset(elem) {
    return Math.abs(elem.getBoundingClientRect().top)
  }

  function make_active(sectionIndex) {
    if(sectionIndex === cur_index) return
    cur_index = sectionIndex

    sel.classed('active', (d,i) => i === sectionIndex)
      .transition()
      .duration(500)
        .style('opacity', (d,i) => i === sectionIndex ? .95 : 0.1)

    nav.classed('active', (d,i) => i === sectionIndex)

    // update state and send any embedded message
    cur_index = sectionIndex

    sel.each( function(d,i) {
      if(i !== cur_index) return

      let elem = d3.select(this)
        .select('script.message')
        .node()

      callback.apply(elem, [d,i])
    })
  }

  function scrolled(ev) {
    var pos = window.pageYOffset + 150
    var sectionIndex = d3.bisect(sectionPositions, pos)
    sectionIndex = Math.max(0, Math.min(sectionIndex, sectionPositions.length-1))
    make_active(sectionIndex)
  }
}

export { scroller as default }
