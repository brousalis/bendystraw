'use strict';

var util = require('../util');

var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create('server');
var reload = browserSync.reload;
var browserSyncSpa = require('browser-sync-spa');

// Better support for Angular and BrowserSync
browserSync.use(browserSyncSpa({selector: '[ng-app]'}));

// Development server
function server(callback) {
  browserSync.init({
    startPath: '/',
    server: {
      baseDir: [config.paths.tmp, config.paths.src],
      routes: {'/bower_components': 'bower_components'}
    },
    port: config.port
  });

  // Watch the root index file for changes
  browserSync.watch(path.join(config.paths.src, '*.html'))
  .on('change', function() {
    runSequence('inject', reload)
  });

  callback();
}

gulp.task('browsersync', server);

gulp.task('server', function(callback) {
  util.log('Starting server in ' + gutil.colors.yellow(process.env.NODE_ENV) + ' environment');

  runSequence(
    'clean',
    'watch',
    'browsersync',
    callback
  );
});

gulp.task('default', ['server']);

module.exports = server;
