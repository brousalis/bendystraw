'use strict';

var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');

// Task to watch files for changes, and reload them
function watch() {

  // When template HTML files are changed, recompile them
  gulp.watch(
    path.join(config.paths.src, '**/*.{' + config.extensions.templates + '}'),
    function(event) {
      if (event.type === 'changed') {
        gulp.start('templates');
      } else {
        gulp.start('inject');
      }
    }
  );

  // When stylesheets are changed, recompile them
  gulp.watch([
      path.join(config.paths.src, config.paths.styles, '**/*.{' + config.extensions.styles + '}'),
      path.join(config.paths.src, config.paths.scripts, '**/*.{' + config.extensions.styles + '}'),
    ],
    function(event) {
      if (event.type === 'changed') {
        runSequence('styles','lint');
      } else {
        runSequence('inject','lint');
      }
    }
  );

  // When javascript files are changed, recompile them
  gulp.watch(
    path.join(config.paths.src, config.paths.scripts, '**/*.{' + config.extensions.scripts + '}'),
    function(event) {
      if (event.type === 'changed') {
        runSequence('scripts','lint');
      } else {
        gulp.start('inject');
      }
    }
  );

  // When images are added to the app, optimize them
  gulp.watch(
    path.join(config.paths.src, config.paths.images, '**/*'),
    function(event) {
      if (event.type === 'added')
        gulp.start('images:optimize')
    }
  );
}

gulp.task('watch', ['inject'], watch);

module.exports = watch;
