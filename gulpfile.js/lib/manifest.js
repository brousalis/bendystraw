'use strict';

var fs = require('fs');

exports.file = function() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}

exports.version = function() {
  return 'v' + exports.file().version
}

exports.name = function() {
  return exports.file().name
}
