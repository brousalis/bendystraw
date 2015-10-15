'use strict';

var gulp = require('gulp');
var path = require('path');
var karma = require('karma');

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
