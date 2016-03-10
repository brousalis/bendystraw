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

gulp.task('test', ['scripts'], function(callback) {
  runTests(true, callback);
});

gulp.task('test:watch', ['watch'], function(callback) {
  runTests(false, callback);
});

module.exports = runTests;
