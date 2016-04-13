'use strict';

var util = require('../util');

var gulp = require('gulp');
var notifier = require('node-notifier');
var gutil = require('gulp-util');
var path = require('path');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create('server');
var reload = browserSync.reload;
var browserSyncSpa = require('browser-sync-spa');

// Better support for Angular and BrowserSync
if (config.angular.enabled)
  browserSync.use(browserSyncSpa({selector: '[ng-app]'}));

// Development server
function server(callback) {
  browserSync.init({
    startPath: '/',
    server: {
      baseDir: [config.paths.dev, config.paths.src],
      routes: {'/bower_components': 'bower_components'}
    },
    notify: config.browserSync.notify,
    open: config.browserSync.open,
    port: config.browserSync.port,
    ghostMode: config.browserSync.ghostMode,
    logPrefix: function() {
      return gutil.colors.green('[bendystraw] ');
    }
  });

  // Watch the root index file for changes
  browserSync
    .watch(path.join(config.paths.src, '*.html'))
    .on('change', function() {
      runSequence('inject', reload)
    });

  callback();
}

gulp.task('browsersync', server);

gulp.task('notify', function(callback) {
  notifier.notify({
    title: 'bendystraw',
    message: 'Server is running on localhost:' + config.browserSync.port,
    icon: path.join(__dirname, '../lib/logo.png'),
    sound: true
  })
  callback();
})

gulp.task('server', function(callback) {
  util.log('Starting server in ' + gutil.colors.yellow(process.env.NODE_ENV) + ' environment');

  runSequence(
    'clean',
    'watch',
    'browsersync',
    'notify',
    callback
  );
});

gulp.task('default', ['server']);

module.exports = server;
