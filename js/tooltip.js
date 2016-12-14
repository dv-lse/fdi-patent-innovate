import * as d3 from 'd3'

/* prettier tooltips than native ones */
function tooltip(sel) {
  sel.each( function() {
    let elem = d3.select(this)
    let title = elem.attr('title')
    elem.attr('alt', title)
      .attr('title', null)
    })
  .on('mouseover', function() {
    let pos = this.getBoundingClientRect()
    let elem = d3.select(this)
    let title = elem.attr('alt')
    let tooltip = d3.select('body')
      .append('a')
      .attr('id', 'tooltip')
      .text(title)
      .style('top', (pos.top + 20) + 'px')
      .style('left', (pos.left - 20) + 'px')
  })
  .on('mouseout', function() {
    d3.select('#tooltip').remove()
  })
}

export { tooltip as default }
