
  function drawLegend() {
    if(!state.label) return

    let fmt = d3.format('2s')
    if(state.format)
      fmt = Array.isArray(state.format) ? (d,i) => state.format[i] : d3.format(state.format)

    let em_height = context.measureText('M').width
    let legend_height = LEGEND_PADDING[0] + (state.symbols && state.legend ? LEGEND_HEIGHT + SYMBOL_WIDTH * 2 : 0) + LEGEND_PADDING[2]

    let top = LEGEND_MARGIN //- LEGEND_PADDING[0] - em_height
    let legend_width = 300 // width - LEGEND_MARGIN - LEFT_PADDING + (width - LEFT_PADDING) / 2 + LEGEND_PADDING[1] + LEGEND_PADDING[3]
    let left = width - LEGEND_MARGIN * 2 - legend_width // LEFT_PADDING + (width - LEFT_PADDING) / 2 - LEGEND_PADDING[3]

    context.save()
    context.fillStyle = 'lightgray' //'rgba(255,255,255,.95)'
    context.fillRect(left, top, legend_width, legend_height)
    context.strokeStyle = 'black'
    context.strokeRect(left, top, legend_width, legend_height)

    if(state.label) {
      context.fillStyle = 'black'
      context.textBaseline = 'bottom'
      context.textAlign = 'left'
      context.font = LEGEND_FONT
      context.fillText(state.label, left + LEGEND_PADDING[3], LEGEND_MARGIN + LEGEND_PADDING[0] + em_height)
    }

    if(state.symbols && state.legend) {
      let ticks = (state.thresholds || symbolscale.ticks(4)).slice().reverse()
      let coords = ticks.map( (c) => {
        let radius = Math.abs(symbolscale(c))
        let coords = [left + legend_width / 3, top + legend_height - LEGEND_PADDING[2] - radius]
        return { value: c, radius: radius, coords: coords }
      })

      coords.forEach( (d) => circle(context, d.coords, d.radius, state.color, SYMBOL_STROKE) )

      context.font = '12px sans-serif'
      context.textBaseline = 'middle'
      context.textAlign = 'right'
      context.strokeStyle = 'white'
      context.fillStyle = 'black'

      coords.forEach( (d, i) => {
        if(d.value === 0) return
        let offset = SYMBOL_WIDTH * 3/2
        context.beginPath()
        context.moveTo(d.coords[0], d.coords[1] - d.radius)
        context.lineTo(d.coords[0] + offset, d.coords[1] - d.radius)
        context.stroke()
        context.fillText(fmt(d.value), d.coords[0] + offset + 50, d.coords[1] - d.radius)
      })
      context.restore()
    }

    context.restore()
  }
