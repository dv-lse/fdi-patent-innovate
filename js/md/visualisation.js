import yaml from 'js-yaml'

function visualisation(md) {
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
}

export default visualisation
