var duplexify = require('duplexify')
var concat = require('concat-stream')
var fromString = require('from2-string')
var defaultUglify = require('uglify-es')

module.exports = uglifyStream

function uglifyStream (opts) {
  opts = opts || {}
  var uglify = opts.uglify || defaultUglify
  delete opts.uglify

  var stream = duplexify()

  var writer = concat({ encoding: 'string' }, function (source) {
    var minified = uglify.minify(source, opts)
    if (minified.error) {
      stream.emit('error', minified.error)
      return
    }
    var reader = fromString(minified.code)
    stream.setReadable(reader)
  })

  stream.setWritable(writer)

  return stream
}
