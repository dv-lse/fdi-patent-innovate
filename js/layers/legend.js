const LEGEND_MARGIN = 15
const LEGEND_PADDING = 8

function legend(context) {

  let size = constant([0,0])
  let queue = []

  function legend(label) {
    context.save()
    context.font = '14pt Roboto'

    let em_height_label = context.measureText('M').width
    let height_label = Math.ceil(label ? em_height_label : 0)
    let width_label = Math.ceil(context.measureText(label).width)

    let width_legend = width_label + LEGEND_PADDING * 2
    let height_legend = height_label + LEGEND_PADDING * 2

    // expand legend height for each enqueued layer
    queue.forEach( (layer) => {
      height_legend += layer.height ? layer.height() : 0
    })

    // legend box

    context.translate(- (LEGEND_MARGIN * 2 + width_label), LEGEND_MARGIN)

    context.fillStyle = 'lightgray'
    context.strokeStyle = 'black'
    context.fillRect(0, 0, width_legend, height_legend)
    context.strokeRect(0, 0, width_legend, height_legend)
    context.translate(LEGEND_PADDING, LEGEND_PADDING)

    // render title label

    context.fillStyle = 'black'
    context.textBaseline = 'hanging'
    context.fillText(label, 0, 0)
    context.translate(0, em_height_label)

    // render all items in queue

    queue.forEach((fn) => {
      fn.call()
      context.translate(0, fn.height ? fn.height() : 0)
    })

    context.restore()
  }

  legend.enqueue = function(layer) {
    queue.push(layer)
  }

  return legend
}

function constant(x) { return () => x }

export { legend }
