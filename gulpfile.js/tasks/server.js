'use strict';

var util = require('../util');

var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

// Better support for Angular and BrowserSync
browserSync.use(browserSyncSpa({selector: '[ng-app]'}));

// Development server
function server() {
  browserSync.instance = browserSync.init({
    startPath: '/',
    server: {
      baseDir: [path.join(config.paths.tmp, '/serve'), config.paths.src],
      routes: {'/bower_components': 'bower_components'}
    },
    port: config.settings.port
  });
}

gulp.task('server', ['watch'], server);

gulp.task('default', ['server']);

module.exports = server;
