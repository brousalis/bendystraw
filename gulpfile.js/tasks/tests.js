'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var karma = require('karma');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

function runTests (singleRun, callback) {
  karma.server.start({
    configFile: path.resolve('karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun
  }, function() {
    callback();
  });
}

// Karma testing
gulp.task('tests', ['scripts'], function(callback) {
  runTests(true, callback);
});

gulp.task('tests:watch', ['watch'], function(callback) {
  runTests(false, callback);
});
