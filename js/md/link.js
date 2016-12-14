function link(md) {

  md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    tokens[idx].attrPush(['target', '_blank'])
    return '<span class="link">' + self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.link_close = function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options) + '</span>'
  }
}

export default link
