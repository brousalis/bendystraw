'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var karma = require('karma');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

function runTests (singleRun, done) {
  karma.server.start({
    configFile: path.resolve('karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun
  }, function() {
    done();
  });
}

// Karma testing
gulp.task('test', ['scripts'], function(done) {
  runTests(true, done);
});

gulp.task('test:watch', ['watch'], function(done) {
  runTests(false, done);
});
