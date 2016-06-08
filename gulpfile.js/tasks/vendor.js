'use strict';

var path = require('path');

var gulp = require('gulp');
var filter = require('gulp-filter');

// Used for non-Bower third party libraries
function vendor(dest) {
  return gulp.src([
    path.join(config.paths.src, config.paths.vendor, '/**/*'),
  ])
    .pipe(gulp.dest(path.join(dest, config.paths.vendor)));
}

gulp.task('vendor', function(callback) {
  vendor(config.paths.dev)
  callback();
});

gulp.task('vendor:build', function(callback) {
  vendor(config.paths.build)
  callback();
});

module.exports = vendor;
