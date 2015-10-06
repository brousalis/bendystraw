'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['inject', 'templates', 'images'], function () {

  // When HTML files are changed (or more bower components added), re-inject
  // files into index.html
  gulp.watch([path.join(config.paths.src, '/*.html'), 'bower.json'], ['inject']);

  // When Jade files are changed, recompile the templates. Causes a full reload
  gulp.watch(path.join(config.paths.src, config.paths.scripts, '/**/*.jade'), ['markup']);

  // When images are changed, optimize them
  gulp.watch(path.join(config.paths.src, '**/*.{' + config.settings.extensions.join(',') + '}'), ['images']);

  // When Stylesheets are changed, recompile them
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

  // When Javascript files are changed, recompile them
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
