'use strict';

var util = require('../util');

var gulp = require('gulp');
var path = require('path');

var Server = require('karma').Server;
var protractor = require('gulp-protractor').protractor;
var webdriver_standalone = require('gulp-protractor').webdriver_standalone;
var webdriver_update = require('gulp-protractor').webdriver_update;

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

// End to end with Protractor
gulp.task('webdriver_update', webdriver_update);
gulp.task('webdriver_standalone', webdriver_standalone);

gulp.task('e2e', ['webdriver_update'], function(callback) {
  gulp.src(path.join(config.paths.tests, config.paths.e2e, '/**/*.{' + config.extensions.scripts + '}'))
    .pipe(protractor({
      configFile: path.resolve('protractor.conf.js'),
      args: ['--baseUrl', config.test.protractor.baseUrl + ':' + config.browserSync.port]
    }))
    .on('error', util.errorHandler('protractor'))
});

module.exports = function(){};
