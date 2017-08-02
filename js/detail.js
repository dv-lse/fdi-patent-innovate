import { max } from 'd3'

const LABEL_FONT = '9pt Roboto'

const NOTCH = 5
const PADDING = 5

const LINE_SPACING = 1.5

// info: pass in an array of lines and key/value pairs

function annotate(context, point, info) {
  info = Array.isArray(info) ? info : [ info ]
  info = info.filter((d) => d)

  context.save()

  context.font = LABEL_FONT
  context.textAlign = 'left'
  context.textBaseline = 'hanging'

  let widest_info = max(info, (d) => context.measureText(d.toString()).width)
  let width = widest_info + PADDING * 2

  let em_height = context.measureText('M').width
  let line_height = em_height * LINE_SPACING

  let height = PADDING + line_height * (info.length-1) + em_height + PADDING

  // text box outline

  let top = point[1] + NOTCH
  let left = point[0] - width / 2
  let middle = point[0]
  let right = point[0] + width / 2
  let bottom = point[1] + NOTCH + height

  context.fillStyle = 'white'
  context.strokeStyle = 'gray'
  context.beginPath()
  context.moveTo(left, top)
  context.lineTo(middle - NOTCH, top)
  context.lineTo(middle, top - NOTCH)
  context.lineTo(middle + NOTCH, top)
  context.lineTo(right, top)
  context.lineTo(right, bottom)
  context.lineTo(left, bottom)
  context.lineTo(left, top)

  context.fill()
  context.stroke()

  info.forEach( (d,i) => {
    let line_top = top + PADDING + i * line_height
    let line_left = left + PADDING
    let line_right = right - PADDING

    let label, value

    if(Array.isArray(d)) {
      label = d[0], value = d[1]
    } else {
      label = null, value = d
    }

    if(label) {
      context.fillStyle = 'gray'
      context.textAlign = 'left'
      context.fillText(label, line_left, line_top)
      context.fillStyle = 'black'
      context.textAlign = 'right'
      context.fillText(value, line_right, line_top)

      if(i < info.length-1) {
        let rule_y = line_top + em_height
        context.strokeStyle = 'rgba(0,0,0,0.2)'
        context.beginPath()
        context.moveTo(line_left, rule_y)
        context.lineTo(line_right, rule_y)
        context.stroke()
      }

    } else {
      context.fillStyle = 'black'
      context.textAlign = 'left'
      context.fillText(value, line_left, line_top)
    }
  })

  context.restore()
}

export { annotate }
