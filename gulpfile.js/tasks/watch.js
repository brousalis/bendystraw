'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

// Task to watch files for changes, and reload them appropriately
// Also copies images from bower_components folder to the dev folder
gulp.task('watch', ['inject', 'images:copy'], function () {

  // When Config files are changed
  gulp.watch(path.join(config.paths.src, config.path.env), ['config'])

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
