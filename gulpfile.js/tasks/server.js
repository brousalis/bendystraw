'use strict';

var gulp = require('gulp');
var path = require('path');
var util = require('util');
var config = require('../config');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

// Better support for Angular and BrowserSync
browserSync.use(browserSyncSpa({
  selector: '[ng-app]'
}));

function browserSyncInit(baseDir) {
  var routes = null;
  if(baseDir === config.paths.src || (util.isArray(baseDir) && baseDir.indexOf(config.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
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
gulp.task('server', ['watch', 'images:copy'], function () {
  process.env.NODE_ENV = 'development';
  browserSyncInit([path.join(config.paths.tmp, '/serve'), config.paths.src]);
});
gulp.task('development', ['set-development', 'server']);
gulp.task('dev', ['server']);

// Staging server
gulp.task('server:staging', ['set-staging', 'build'], function () {
  browserSyncInit(config.paths.dest);
});
gulp.task('staging', ['server:staging']);

// Production server
gulp.task('server:production', ['set-production', 'build'], function () {
  browserSyncInit(config.paths.dest);
});
gulp.task('production', ['server:production']);
