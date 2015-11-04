'use strict';

var gulp = require('gulp');
var path = require('path');
var util = require('util');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

// Better support for Angular and BrowserSync
browserSync.use(browserSyncSpa({selector: '[ng-app]'}));

// Init a browserSync server
function browserSyncInit(baseDir) {
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
gulp.task('server', ['set-development', 'watch'], function () {
  browserSyncInit([path.join(config.paths.tmp, '/serve'), config.paths.src]);
});
gulp.task('development', ['server']);
gulp.task('dev', ['server']);

// Staging server
gulp.task('server:staging', ['set-staging', 'make'], browserSyncInit(config.paths.dest));
gulp.task('staging', ['server:staging']);
gulp.task('staging:run', ['set-staging'], browserSyncInit(config.paths.dest));

// Production server
gulp.task('server:build', ['set-production', 'make'], browserSyncInit(config.paths.dest));
gulp.task('server:production', ['set-production', 'make'], browserSyncInit(config.paths.dest));
gulp.task('production', ['server:production']);
gulp.task('production:run', ['set-production'], browserSyncInit(config.paths.dest));

module.exports = function(){};
