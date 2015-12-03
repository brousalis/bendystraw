'use strict';

var gulp = require('gulp');
var path = require('path');

// Task to watch files for changes, and reload them
function watch() {
  // When HTML files are changed (or more bower components added)
  gulp.watch([
    path.join(config.paths.src, '/**/*.html'),
    'bower.json',
  ], function(event) {
    if (event.type === 'changed') {
      gulp.start('markup');
    } else {
      gulp.start('inject');
    }
  });

  // When stylesheets are changed
  gulp.watch([
    path.join(config.paths.src, config.paths.scripts, '/**/*.css'),
    path.join(config.paths.src, config.paths.scripts, '/**/*.{sass,scss}'),
    path.join(config.paths.src, config.paths.styles, '/**/*.{sass,scss}')
  ], function(event) {
    if (event.type === 'changed') {
      gulp.start('styles');
    } else {
      gulp.start('inject');
    }
  });

  // When javascript files are changed
  gulp.watch([
    path.join(config.paths.src, config.paths.scripts, '/**/*.{js,coffee}'),
  ], function(event) {
    if (event.type === 'changed') {
      gulp.start('scripts');
    } else {
      gulp.start('inject');
    }
  });
}

gulp.task('watch', ['inject'], watch);

module.exports = watch;
