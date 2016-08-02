'use strict';

var gulp = require('gulp');
var path = require('path');
var del = require('del');

// Cleans the build folder and tmp folder for development
function clean(callback) {
  var folders = [
    path.join(config.paths.build, '/'),
    path.join(config.paths.dev, '/')
  ];

  return del(folders);
}

gulp.task('clean', clean);

module.exports = clean;
