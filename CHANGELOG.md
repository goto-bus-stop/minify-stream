# minify-stream change log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## 2.1.0
* Support asynchronous uglify implementations.
  You can now use minify-stream with terser v5:
  ```js
  var minifyStream = require('minify-stream')
  var minifier = minifyStream({ uglify: require('terser') })
  ```

## 2.0.1
* Unpin default terser version.

## 2.0.0
* Upgrade default terser version to v4.

## 1.2.1
* Pin terser to a version that does uses ES5 syntax.
* Update streams dependencies.

## 1.2.0
* Switch to [terser](https://github.com/fabiosantoscode/terser) as the default uglify module. ([#1](https://github.com/goto-bus-stop/minify-stream/pull/1))

## 1.1.0
* Now outputs sourcemaps by default

## 1.0.0
* Initial release
