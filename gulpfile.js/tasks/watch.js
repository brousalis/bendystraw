'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['inject'], function () {

  // When HTML files are changed (or more bower components added)
  gulp.watch([
    path.join(config.paths.src, '/**/*.html'),
    'bower.json',
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('markup');
    } else {
      gulp.start('inject');
    }
  });

  // When stylesheets are changed
  gulp.watch([
    path.join(config.paths.src, config.paths.scripts, '/**/*.css'),
    path.join(config.paths.src, config.paths.scripts, '/**/*.sass'),
    path.join(config.paths.src, config.paths.styles, '/**/*.sass')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('styles');
    } else {
      gulp.start('inject');
    }
  });

  // When javascript files are changed
  gulp.watch([
    path.join(config.paths.src, config.paths.scripts, '/**/*.js'),
    path.join(config.paths.src, config.paths.scripts, '/**/*.coffee')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('scripts');
    } else {
      gulp.start('inject');
    }
  });
});
