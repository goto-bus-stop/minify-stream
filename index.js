var duplexify = require('duplexify')
var concat = require('concat-stream')
var fromString = require('from2-string')
var defaultUglify = require('terser')
var convert = require('convert-source-map')
var xtend = require('xtend')

module.exports = uglifyStream

function defaultOpts () {
  return {
    sourceMap: { content: 'inline' }
  }
}

function uglifyStream (opts) {
  opts = xtend(defaultOpts(), opts || {})
  var uglify = opts.uglify || defaultUglify
  delete opts.uglify

  var stream = duplexify()

  var writer = concat({ encoding: 'string' }, function (source) {
    var result = uglify.minify(source, opts)
    if (result.then) {
      result.then(onsuccess, onerror)
    } else if (result.error) {
      return onerror(result.error)
    } else onsuccess(result)

    function onsuccess (minified) {
      var final = minified.code
      if (minified.map) {
        final += '\n' + convert.fromJSON(minified.map).toComment()
      }
      var reader = fromString(final)
      stream.setReadable(reader)
    }
    function onerror (error) {
      stream.emit('error', error)
    }
  })

  stream.setWritable(writer)

  return stream
}
