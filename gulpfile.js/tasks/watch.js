'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['markups', 'inject'], function () {

  gulp.watch([path.join(config.paths.src, '/*.html'), 'bower.json'], ['inject']);

  gulp.watch([
    path.join(config.paths.src, '/app/**/*.css'),
    path.join(config.paths.src, '/app/**/*.sass')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('styles');
    } else {
      gulp.start('inject');
    }
  });

  gulp.watch([
    path.join(config.paths.src, '/app/**/*.js'),
    path.join(config.paths.src, '/app/**/*.coffee')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('scripts');
    } else {
      gulp.start('inject');
    }
  });

  gulp.watch(path.join(config.paths.src, '/app/**/*.jade'), ['markups']);

  gulp.watch(path.join(config.paths.src, '/app/**/*.html'), function(event) {
    browserSync.reload(event.path);
  });
});
