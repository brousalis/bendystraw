'use strict';

var util = require('../util');

var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

// Better support for Angular and BrowserSync
browserSync.use(browserSyncSpa({selector: '[ng-app]'}));

// Development server
function server() {
  browserSync.instance = browserSync.init({
    startPath: '/',
    server: {
      baseDir: [config.paths.tmp, config.paths.src],
      routes: {'/bower_components': 'bower_components'}
    },
    port: config.port
  });
}

gulp.task('server', function(callback) {
  runSequence('clean', ['watch'], server);
});

gulp.task('default', ['server']);

module.exports = server;
