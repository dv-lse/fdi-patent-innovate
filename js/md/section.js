function section(md) {

  md.core.ruler.push('section', (state) => {
    let tokens = []
    let headings = 0
    let i = 0

    while(state.tokens[i].type === 'front_matter') {
      tokens.push(state.tokens[i])
      i++
    }
    openSection()

    while(i<state.tokens.length) {
      let token = state.tokens[i]

      if(token.type === 'heading_open' && token.tag <= 'h3') {
        if(headings > 0) {
          closeSection()
          openSection()
        }
        tokens.push(token)
        headings++
      } else if (token.type === 'hr') {
        closeSection()
        openSection()
      } else {
        tokens.push(token)
      }
      i++
    }
    closeSection()

    state.tokens = tokens

    function openSection() {
      let t = new state.Token('section_open', 'section', 0)
      t.block = true
      tokens.push(t)
    }

    function closeSection() {
      var t = new state.Token('section_close', 'section', 0)
      t.block = true
      t.tag = '/section'
      tokens.push(t)
    }
  })
}

export default section
