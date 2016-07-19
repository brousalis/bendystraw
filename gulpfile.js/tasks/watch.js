'use strict';

var gulp = require('gulp');
var path = require('path');

// Task to watch files for changes, and reload them
function watch() {

  function changed(task) {
    return function(event) {
      gulp.start('lint');
      if (event.type === 'changed') {
        gulp.start(task);
      } else {
        gulp.start('inject');
      }
    }
  }

  // When template HTML files are changed, recompile them
  gulp.watch(
    path.join(config.paths.src, '**/*.{' + config.extensions.templates + '}'),
    changed('templates')
  );

  // When stylesheets are changed, recompile them
  gulp.watch([
      path.join(config.paths.src, config.paths.styles, '**/*.{' + config.extensions.styles + '}'),
      path.join(config.paths.src, config.paths.scripts, '**/*.{' + config.extensions.styles + '}'),
    ],
    changed('styles')
  );

  // When javascript files are changed, recompile them
  gulp.watch(
    path.join(config.paths.src, config.paths.scripts, '**/*.{' + config.extensions.scripts + '}'),
    changed('scripts')
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
