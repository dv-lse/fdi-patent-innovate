import { max } from 'd3'

const LABEL_FONT = '9pt Roboto'

const NOTCH = 5
const PADDING = 5

const LINE_SPACING = 1.5

// info: pass in an array of lines and key/value pairs

function bounds(context, point, info, orientation=0) {
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
  let notch_xp = orientation <  6 ? 1 + (NOTCH * 2) / width : - (NOTCH * 2) / width
  let notch_yp = orientation >= 6 ? 1 + (NOTCH * 2) / height : - (NOTCH * 2) / height
  switch(orientation) {
    case 0:
    case 8: notch_xp = 1/7; break;
    case 1:
    case 7: notch_xp = 1/2; break;
    case 2:
    case 6: notch_xp = 6/7; break;
    case 3:
    case 11: notch_yp = 1/7; break;
    case 4:
    case 10: notch_yp = 1/2; break;
    case 5:
    case 9: notch_yp = 6/7; break;
  }

  let left = point[0] - width * notch_xp
  let right = left + width
  let top = point[1] - height * notch_yp
  let bottom = top + height

  context.restore()

  return [top, right, bottom, left]
}

function annotate(context, point, info, orientation=0) {
  info = Array.isArray(info) ? info : [ info ]
  info = info.filter((d) => d)

  context.save()

  context.font = LABEL_FONT
  context.textAlign = 'left'
  context.textBaseline = 'hanging'

  let em_height = context.measureText('M').width
  let line_height = em_height * LINE_SPACING

  let [top,right,bottom,left] = bounds(context, point, info, orientation)

  context.fillStyle = 'white'
  context.strokeStyle = 'gray'
  context.beginPath()

  context.moveTo(left, top)
  if(orientation < 3) {
     context.lineTo(point[0] - NOTCH, top);
     context.lineTo(point[0], top - NOTCH);
     context.lineTo(point[0] + NOTCH, top);
   }
  context.lineTo(right, top)
  if(orientation >= 3 && orientation < 6) {
    context.lineTo(right, point[1] - NOTCH);
    context.lineTo(right + NOTCH, point[1]);
    context.lineTo(right, point[1] + NOTCH);
  }
  context.lineTo(right, bottom)
  if(orientation >= 6 && orientation < 9) {
    context.lineTo(point[0] + NOTCH, bottom);
    context.lineTo(point[0], bottom + NOTCH);
    context.lineTo(point[0] - NOTCH, bottom);
  }
  context.lineTo(left, bottom)
  if(orientation >= 9) {
    context.lineTo(left, point[1] + NOTCH);
    context.lineTo(left - NOTCH, point[1]);
    context.lineTo(left, point[1] - NOTCH);
  }
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
