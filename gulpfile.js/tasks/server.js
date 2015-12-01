'use strict';

var util = require('../util');

var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

// Better support for Angular and BrowserSync
browserSync.use(browserSyncSpa({selector: '[ng-app]'}));

// Init a browserSync server
function server(baseDir) {
  var routes = null;
  if(baseDir === config.paths.src || (util.isArray(baseDir) && baseDir.indexOf(config.paths.src) !== -1)) {
    routes = {'/bower_components': 'bower_components'};
  }

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: {
      baseDir: baseDir,
      routes: routes
    },
    port: config.settings.port
  });
}

// Development server
gulp.task('server', ['watch'], function () {
  server([path.join(config.paths.tmp, '/serve'), config.paths.src]);
});

gulp.task('default', ['server']);

module.exports = server;
