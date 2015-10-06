'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var util = require('util');
var proxyMiddleware = require('http-proxy-middleware');

// Better support for Angular and Browsersync
browserSync.use(browserSyncSpa({
  selector: '[ng-app]'
}));

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === config.paths.src || (util.isArray(baseDir) && baseDir.indexOf(config.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  // server.middleware = proxyMiddleware('/api', {target: 'https://api.bellycard.com', proxyHost: 'api.bellycard.com'});

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    port: 4567,
    browser: browser
  });
}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([path.join(config.paths.tmp, '/serve'), config.paths.src]);
});

gulp.task('serve:build', ['build'], function () {
  browserSyncInit(config.paths.dist);
});

gulp.task('serve:tests', ['inject'], function () {
  browserSyncInit([config.paths.tmp + '/serve', config.paths.src], []);
});

gulp.task('serve:tests:build', ['build'], function () {
  browserSyncInit(config.paths.dist, []);
});
