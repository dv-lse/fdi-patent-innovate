function link(md) {

  let defaultRender = md.renderer.rules.link_open || this.defaultRender

  md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    tokens[idx].attrPush(['target', '_blank'])
    return defaultRender(tokens, idx, options, env, self)
  }
}

link.defaultRender = function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

export default link
