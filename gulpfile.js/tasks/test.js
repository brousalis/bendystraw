'use strict';

var gulp = require('gulp');
var path = require('path');

var Server = require('karma').Server;

// Run tests with Karma
gulp.task('test', ['lint:build'], function(callback) {
  new Server({
    singleRun: true,
    configFile: path.resolve('karma.conf.js')
  }, function() {
    callback();
  }).start();
});

// Run tests with Karma and watch for file changes
gulp.task('tdd', ['lint'], function (callback) {
  new Server({
    configFile: path.resolve('karma.conf.js')
  }, function() {
    callback();
  }).start();
});

module.exports = function(){};
