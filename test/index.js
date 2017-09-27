var test = require('tape')
var minify = require('../')
var fromString = require('from2-string')
var concat = require('concat-stream')
var dedent = require('dedent')

test('Example Test', function (t) {
  t.plan(2)
  fromString(dedent`
    global.value = (function a () {
      var b = 2
      function test () {
        return 1 + b
      }
      return test()
    }())
  `).pipe(minify()).pipe(concat({ encoding: 'string' }, function (result) {
    t.ok(result)
    eval(result) // eslint-disable-line no-eval
    t.equal(global.value, 3)
    delete global.value
  }))
})

test('emits errors', function (t) {
  t.plan(2)
  var src = dedent`
    (function() {
      syntax error;
    })();
  `

  var stream = minify()
  stream.on('data', function () {})
  stream.on('error', function (err) {
    t.ok(err)
    t.ok(/Unexpected token: name/.test(err.message))
  })
  stream.end(src)
})

test('supports es2015 syntax', function (t) {
  t.plan(1)

  var src = [
    'const fn = (...args) => {',
    '  return args.map(x => x ** 2);',
    '};'
  ].join('\n')

  var stream = minify()
  stream.pipe(concat({ encoding: 'string' }, done))
  stream.on('error', t.fail)
  stream.end(src)

  function done (result) {
    result = result.toString()
    t.notEqual(result, src)
  }
})
