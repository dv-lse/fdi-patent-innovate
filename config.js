System.config({
  baseURL: "/fdi-patent-innovate",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  bundles: {
    "build.js": [
      "index.js",
      "js/tooltip.js",
      "npm:d3@4.4.0.js",
      "npm:d3@4.4.0/build/d3.js",
      "github:jspm/nodelibs-process@0.1.2.js",
      "github:jspm/nodelibs-process@0.1.2/index.js",
      "npm:process@0.11.9.js",
      "npm:process@0.11.9/browser.js",
      "github:jspm/nodelibs-buffer@0.1.0.js",
      "github:jspm/nodelibs-buffer@0.1.0/index.js",
      "npm:buffer@3.6.0.js",
      "npm:buffer@3.6.0/index.js",
      "npm:isarray@1.0.0.js",
      "npm:isarray@1.0.0/index.js",
      "npm:ieee754@1.1.8.js",
      "npm:ieee754@1.1.8/index.js",
      "npm:base64-js@0.0.8.js",
      "npm:base64-js@0.0.8/lib/b64.js",
      "js/trend.js",
      "js/util/regression.js",
      "npm:babel-runtime@5.8.38/core-js/object/assign.js",
      "npm:core-js@1.2.7/library/fn/object/assign.js",
      "npm:core-js@1.2.7/library/modules/$.core.js",
      "npm:core-js@1.2.7/library/modules/es6.object.assign.js",
      "npm:core-js@1.2.7/library/modules/$.object-assign.js",
      "npm:core-js@1.2.7/library/modules/$.fails.js",
      "npm:core-js@1.2.7/library/modules/$.iobject.js",
      "npm:core-js@1.2.7/library/modules/$.cof.js",
      "npm:core-js@1.2.7/library/modules/$.to-object.js",
      "npm:core-js@1.2.7/library/modules/$.defined.js",
      "npm:core-js@1.2.7/library/modules/$.js",
      "npm:core-js@1.2.7/library/modules/$.export.js",
      "npm:core-js@1.2.7/library/modules/$.ctx.js",
      "npm:core-js@1.2.7/library/modules/$.a-function.js",
      "npm:core-js@1.2.7/library/modules/$.global.js",
      "js/globe.js",
      "js/layers/legend.js",
      "js/layers/symbols.js",
      "js/detail.js",
      "npm:babel-runtime@5.8.38/helpers/sliced-to-array.js",
      "npm:babel-runtime@5.8.38/core-js/is-iterable.js",
      "npm:core-js@1.2.7/library/fn/is-iterable.js",
      "npm:core-js@1.2.7/library/modules/core.is-iterable.js",
      "npm:core-js@1.2.7/library/modules/$.iterators.js",
      "npm:core-js@1.2.7/library/modules/$.wks.js",
      "npm:core-js@1.2.7/library/modules/$.uid.js",
      "npm:core-js@1.2.7/library/modules/$.shared.js",
      "npm:core-js@1.2.7/library/modules/$.classof.js",
      "npm:core-js@1.2.7/library/modules/es6.string.iterator.js",
      "npm:core-js@1.2.7/library/modules/$.iter-define.js",
      "npm:core-js@1.2.7/library/modules/$.set-to-string-tag.js",
      "npm:core-js@1.2.7/library/modules/$.has.js",
      "npm:core-js@1.2.7/library/modules/$.iter-create.js",
      "npm:core-js@1.2.7/library/modules/$.hide.js",
      "npm:core-js@1.2.7/library/modules/$.descriptors.js",
      "npm:core-js@1.2.7/library/modules/$.property-desc.js",
      "npm:core-js@1.2.7/library/modules/$.redefine.js",
      "npm:core-js@1.2.7/library/modules/$.library.js",
      "npm:core-js@1.2.7/library/modules/$.string-at.js",
      "npm:core-js@1.2.7/library/modules/$.to-integer.js",
      "npm:core-js@1.2.7/library/modules/web.dom.iterable.js",
      "npm:core-js@1.2.7/library/modules/es6.array.iterator.js",
      "npm:core-js@1.2.7/library/modules/$.to-iobject.js",
      "npm:core-js@1.2.7/library/modules/$.iter-step.js",
      "npm:core-js@1.2.7/library/modules/$.add-to-unscopables.js",
      "npm:babel-runtime@5.8.38/core-js/get-iterator.js",
      "npm:core-js@1.2.7/library/fn/get-iterator.js",
      "npm:core-js@1.2.7/library/modules/core.get-iterator.js",
      "npm:core-js@1.2.7/library/modules/core.get-iterator-method.js",
      "npm:core-js@1.2.7/library/modules/$.an-object.js",
      "npm:core-js@1.2.7/library/modules/$.is-object.js",
      "npm:d3-geo@1.3.1.js",
      "npm:d3-geo@1.3.1/build/d3-geo.js",
      "npm:d3-array@1.0.1.js",
      "npm:d3-array@1.0.1/build/d3-array.js",
      "js/layers/flowmap.js",
      "js/layers/core.js",
      "js/scroller.js",
      "npm:debounce@1.0.0.js",
      "npm:debounce@1.0.0/index.js",
      "npm:date-now@1.0.1.js",
      "npm:date-now@1.0.1/index.js",
      "js/md/message.js",
      "npm:js-yaml@3.6.1.js",
      "npm:js-yaml@3.6.1/index.js",
      "npm:js-yaml@3.6.1/lib/js-yaml.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/exception.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/schema/default_full.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/js/function.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/js/regexp.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/js/undefined.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/schema/default_safe.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/set.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/pairs.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/omap.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/binary.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/merge.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/timestamp.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/schema/core.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/schema/json.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/float.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/common.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/int.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/bool.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/null.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/schema/failsafe.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/map.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/seq.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/type/str.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/schema.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/dumper.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/loader.js",
      "npm:js-yaml@3.6.1/lib/js-yaml/mark.js",
      "js/md/section.js",
      "js/md/front_matter.js",
      "npm:markdown-it@8.0.1.js",
      "npm:markdown-it@8.0.1/index.js",
      "npm:markdown-it@8.0.1/lib/index.js",
      "npm:markdown-it@8.0.1/lib/presets/commonmark.js",
      "npm:markdown-it@8.0.1/lib/presets/zero.js",
      "npm:markdown-it@8.0.1/lib/presets/default.js",
      "github:jspm/nodelibs-punycode@0.1.0.js",
      "github:jspm/nodelibs-punycode@0.1.0/index.js",
      "npm:punycode@1.3.2.js",
      "npm:punycode@1.3.2/punycode.js",
      "npm:mdurl@1.0.1.js",
      "npm:mdurl@1.0.1/index.js",
      "npm:mdurl@1.0.1/parse.js",
      "npm:mdurl@1.0.1/format.js",
      "npm:mdurl@1.0.1/decode.js",
      "npm:mdurl@1.0.1/encode.js",
      "npm:linkify-it@2.0.2.js",
      "npm:linkify-it@2.0.2/index.js",
      "npm:linkify-it@2.0.2/lib/re.js",
      "npm:uc.micro@1.0.3/categories/P/regex.js",
      "npm:uc.micro@1.0.3/categories/Z/regex.js",
      "npm:uc.micro@1.0.3/categories/Cc/regex.js",
      "npm:uc.micro@1.0.3/properties/Any/regex.js",
      "npm:markdown-it@8.0.1/lib/parser_inline.js",
      "npm:markdown-it@8.0.1/lib/rules_inline/state_inline.js",
      "npm:markdown-it@8.0.1/lib/common/utils.js",
      "npm:uc.micro@1.0.3.js",
      "npm:uc.micro@1.0.3/index.js",
      "npm:uc.micro@1.0.3/categories/Cf/regex.js",
      "npm:markdown-it@8.0.1/lib/common/entities.js",
      "npm:entities@1.1.1/maps/entities.json!github:systemjs/plugin-json@0.1.2.js",
      "npm:markdown-it@8.0.1/lib/token.js",
      "npm:markdown-it@8.0.1/lib/rules_inline/text_collapse.js",
      "npm:markdown-it@8.0.1/lib/rules_inline/balance_pairs.js",
      "npm:markdown-it@8.0.1/lib/rules_inline/entity.js",
      "npm:markdown-it@8.0.1/lib/rules_inline/html_inline.js",
      "npm:markdown-it@8.0.1/lib/common/html_re.js",
      "npm:markdown-it@8.0.1/lib/rules_inline/autolink.js",
      "npm:markdown-it@8.0.1/lib/rules_inline/image.js",
      "npm:markdown-it@8.0.1/lib/helpers/parse_link_title.js",
      "npm:markdown-it@8.0.1/lib/helpers/parse_link_destination.js",
      "npm:markdown-it@8.0.1/lib/helpers/parse_link_label.js",
      "npm:markdown-it@8.0.1/lib/rules_inline/link.js",
      "npm:markdown-it@8.0.1/lib/rules_inline/emphasis.js",
      "npm:markdown-it@8.0.1/lib/rules_inline/strikethrough.js",
      "npm:markdown-it@8.0.1/lib/rules_inline/backticks.js",
      "npm:markdown-it@8.0.1/lib/rules_inline/escape.js",
      "npm:markdown-it@8.0.1/lib/rules_inline/newline.js",
      "npm:markdown-it@8.0.1/lib/rules_inline/text.js",
      "npm:markdown-it@8.0.1/lib/ruler.js",
      "npm:markdown-it@8.0.1/lib/parser_block.js",
      "npm:markdown-it@8.0.1/lib/rules_block/state_block.js",
      "npm:markdown-it@8.0.1/lib/rules_block/paragraph.js",
      "npm:markdown-it@8.0.1/lib/rules_block/html_block.js",
      "npm:markdown-it@8.0.1/lib/common/html_blocks.js",
      "npm:markdown-it@8.0.1/lib/rules_block/lheading.js",
      "npm:markdown-it@8.0.1/lib/rules_block/heading.js",
      "npm:markdown-it@8.0.1/lib/rules_block/reference.js",
      "npm:markdown-it@8.0.1/lib/rules_block/list.js",
      "npm:markdown-it@8.0.1/lib/rules_block/hr.js",
      "npm:markdown-it@8.0.1/lib/rules_block/blockquote.js",
      "npm:markdown-it@8.0.1/lib/rules_block/fence.js",
      "npm:markdown-it@8.0.1/lib/rules_block/code.js",
      "npm:markdown-it@8.0.1/lib/rules_block/table.js",
      "npm:markdown-it@8.0.1/lib/parser_core.js",
      "npm:markdown-it@8.0.1/lib/rules_core/state_core.js",
      "npm:markdown-it@8.0.1/lib/rules_core/smartquotes.js",
      "npm:markdown-it@8.0.1/lib/rules_core/replacements.js",
      "npm:markdown-it@8.0.1/lib/rules_core/linkify.js",
      "npm:markdown-it@8.0.1/lib/rules_core/inline.js",
      "npm:markdown-it@8.0.1/lib/rules_core/block.js",
      "npm:markdown-it@8.0.1/lib/rules_core/normalize.js",
      "npm:markdown-it@8.0.1/lib/renderer.js",
      "npm:markdown-it@8.0.1/lib/helpers/index.js",
      "npm:topojson-client@2.1.0.js",
      "npm:topojson-client@2.1.0/dist/topojson-client.js",
      "npm:d3-queue@3.0.3.js",
      "npm:d3-queue@3.0.3/build/d3-queue.js",
      "npm:babel-runtime@5.8.38/helpers/to-consumable-array.js",
      "npm:babel-runtime@5.8.38/core-js/array/from.js",
      "npm:core-js@1.2.7/library/fn/array/from.js",
      "npm:core-js@1.2.7/library/modules/es6.array.from.js",
      "npm:core-js@1.2.7/library/modules/$.iter-detect.js",
      "npm:core-js@1.2.7/library/modules/$.to-length.js",
      "npm:core-js@1.2.7/library/modules/$.is-array-iter.js",
      "npm:core-js@1.2.7/library/modules/$.iter-call.js"
    ]
  },

  map: {
    "babel": "npm:babel-core@5.8.38",
    "babel-runtime": "npm:babel-runtime@5.8.38",
    "core-js": "npm:core-js@1.2.7",
    "d3": "npm:d3@4.4.0",
    "d3-geo": "npm:d3-geo@1.3.1",
    "d3-geo-projection": "npm:d3-geo-projection@1.2.1",
    "d3-queue": "npm:d3-queue@3.0.3",
    "d3-scale-chromatic": "npm:d3-scale-chromatic@1.1.0",
    "debounce": "npm:debounce@1.0.0",
    "geojson-rewind": "npm:geojson-rewind@0.2.0",
    "js-yaml": "npm:js-yaml@3.6.1",
    "json": "github:systemjs/plugin-json@0.2.2",
    "markdown-it": "npm:markdown-it@8.0.1",
    "topojson-client": "npm:topojson-client@2.1.0",
    "world-atlas": "npm:world-atlas@1.1.0",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.9"
    },
    "github:jspm/nodelibs-punycode@0.1.0": {
      "punycode": "npm:punycode@1.3.2"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-string_decoder@0.1.0": {
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "npm:argparse@1.0.9": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "sprintf-js": "npm:sprintf-js@1.0.3",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bops@0.0.6": {
      "base64-js": "npm:base64-js@0.0.2",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "to-utf8": "npm:to-utf8@0.0.1"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.8",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:commander@2.9.0": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "graceful-readlink": "npm:graceful-readlink@1.0.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:concat-stream@1.2.1": {
      "bops": "npm:bops@0.0.6",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:core-js@1.2.7": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:d3-brush@1.0.3": {
      "d3-dispatch": "npm:d3-dispatch@1.0.2",
      "d3-drag": "npm:d3-drag@1.0.2",
      "d3-interpolate": "npm:d3-interpolate@1.1.2",
      "d3-selection": "npm:d3-selection@1.0.3",
      "d3-transition": "npm:d3-transition@1.0.3"
    },
    "npm:d3-chord@1.0.3": {
      "d3-array": "npm:d3-array@1.0.2",
      "d3-path": "npm:d3-path@1.0.3"
    },
    "npm:d3-drag@1.0.2": {
      "d3-dispatch": "npm:d3-dispatch@1.0.2",
      "d3-selection": "npm:d3-selection@1.0.3"
    },
    "npm:d3-dsv@1.0.3": {
      "commander": "npm:commander@2.9.0",
      "iconv-lite": "npm:iconv-lite@0.4.15",
      "rw": "npm:rw@1.3.2"
    },
    "npm:d3-force@1.0.4": {
      "d3-collection": "npm:d3-collection@1.0.2",
      "d3-dispatch": "npm:d3-dispatch@1.0.2",
      "d3-quadtree": "npm:d3-quadtree@1.0.2",
      "d3-timer": "npm:d3-timer@1.0.3",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:d3-geo-projection@1.2.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "commander": "npm:commander@2.9.0",
      "d3-array": "npm:d3-array@1.0.1",
      "d3-geo": "npm:d3-geo@1.3.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "readline": "github:jspm/nodelibs-readline@0.1.0"
    },
    "npm:d3-geo@1.3.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "d3-array": "npm:d3-array@1.0.1"
    },
    "npm:d3-geo@1.4.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "d3-array": "npm:d3-array@1.0.2"
    },
    "npm:d3-interpolate@1.1.1": {
      "d3-color": "npm:d3-color@1.0.1"
    },
    "npm:d3-interpolate@1.1.2": {
      "d3-color": "npm:d3-color@1.0.2"
    },
    "npm:d3-request@1.0.3": {
      "d3-collection": "npm:d3-collection@1.0.2",
      "d3-dispatch": "npm:d3-dispatch@1.0.2",
      "d3-dsv": "npm:d3-dsv@1.0.3",
      "xmlhttprequest": "npm:xmlhttprequest@1.8.0"
    },
    "npm:d3-scale-chromatic@1.1.0": {
      "d3-interpolate": "npm:d3-interpolate@1.1.1"
    },
    "npm:d3-scale@1.0.4": {
      "d3-array": "npm:d3-array@1.0.2",
      "d3-collection": "npm:d3-collection@1.0.2",
      "d3-color": "npm:d3-color@1.0.2",
      "d3-format": "npm:d3-format@1.0.2",
      "d3-interpolate": "npm:d3-interpolate@1.1.2",
      "d3-time": "npm:d3-time@1.0.4",
      "d3-time-format": "npm:d3-time-format@2.0.3"
    },
    "npm:d3-shape@1.0.4": {
      "d3-path": "npm:d3-path@1.0.3"
    },
    "npm:d3-time-format@2.0.3": {
      "d3-time": "npm:d3-time@1.0.4"
    },
    "npm:d3-transition@1.0.3": {
      "d3-color": "npm:d3-color@1.0.2",
      "d3-dispatch": "npm:d3-dispatch@1.0.2",
      "d3-ease": "npm:d3-ease@1.0.2",
      "d3-interpolate": "npm:d3-interpolate@1.1.2",
      "d3-selection": "npm:d3-selection@1.0.3",
      "d3-timer": "npm:d3-timer@1.0.3"
    },
    "npm:d3-zoom@1.1.0": {
      "d3-dispatch": "npm:d3-dispatch@1.0.2",
      "d3-drag": "npm:d3-drag@1.0.2",
      "d3-interpolate": "npm:d3-interpolate@1.1.2",
      "d3-selection": "npm:d3-selection@1.0.3",
      "d3-transition": "npm:d3-transition@1.0.3"
    },
    "npm:d3@4.4.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "d3-array": "npm:d3-array@1.0.2",
      "d3-axis": "npm:d3-axis@1.0.4",
      "d3-brush": "npm:d3-brush@1.0.3",
      "d3-chord": "npm:d3-chord@1.0.3",
      "d3-collection": "npm:d3-collection@1.0.2",
      "d3-color": "npm:d3-color@1.0.2",
      "d3-dispatch": "npm:d3-dispatch@1.0.2",
      "d3-drag": "npm:d3-drag@1.0.2",
      "d3-dsv": "npm:d3-dsv@1.0.3",
      "d3-ease": "npm:d3-ease@1.0.2",
      "d3-force": "npm:d3-force@1.0.4",
      "d3-format": "npm:d3-format@1.0.2",
      "d3-geo": "npm:d3-geo@1.4.0",
      "d3-hierarchy": "npm:d3-hierarchy@1.0.3",
      "d3-interpolate": "npm:d3-interpolate@1.1.2",
      "d3-path": "npm:d3-path@1.0.3",
      "d3-polygon": "npm:d3-polygon@1.0.2",
      "d3-quadtree": "npm:d3-quadtree@1.0.2",
      "d3-queue": "npm:d3-queue@3.0.3",
      "d3-random": "npm:d3-random@1.0.2",
      "d3-request": "npm:d3-request@1.0.3",
      "d3-scale": "npm:d3-scale@1.0.4",
      "d3-selection": "npm:d3-selection@1.0.3",
      "d3-shape": "npm:d3-shape@1.0.4",
      "d3-time": "npm:d3-time@1.0.4",
      "d3-time-format": "npm:d3-time-format@2.0.3",
      "d3-timer": "npm:d3-timer@1.0.3",
      "d3-transition": "npm:d3-transition@1.0.3",
      "d3-voronoi": "npm:d3-voronoi@1.1.0",
      "d3-zoom": "npm:d3-zoom@1.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:debounce@1.0.0": {
      "date-now": "npm:date-now@1.0.1"
    },
    "npm:entities@1.1.1": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:geojson-area@0.1.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "wgs84": "npm:wgs84@0.0.0"
    },
    "npm:geojson-rewind@0.2.0": {
      "concat-stream": "npm:concat-stream@1.2.1",
      "geojson-area": "npm:geojson-area@0.1.0",
      "minimist": "npm:minimist@0.0.5"
    },
    "npm:graceful-readlink@1.0.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:iconv-lite@0.4.15": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:isarray@1.0.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:js-yaml@3.6.1": {
      "argparse": "npm:argparse@1.0.9",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "esprima": "npm:esprima@2.7.3",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:linkify-it@2.0.2": {
      "uc.micro": "npm:uc.micro@1.0.3"
    },
    "npm:markdown-it@8.0.1": {
      "argparse": "npm:argparse@1.0.9",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "entities": "npm:entities@1.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "linkify-it": "npm:linkify-it@2.0.2",
      "mdurl": "npm:mdurl@1.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "punycode": "github:jspm/nodelibs-punycode@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "uc.micro": "npm:uc.micro@1.0.3"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.9": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:readable-stream@1.1.14": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:rw@1.3.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.14"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:to-utf8@0.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:topojson-client@2.1.0": {
      "commander": "npm:commander@2.9.0"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    },
    "npm:xmlhttprequest@1.8.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "url": "github:jspm/nodelibs-url@0.1.0"
    }
  }
});
