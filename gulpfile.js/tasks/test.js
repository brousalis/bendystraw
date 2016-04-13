'use strict';

var gulp = require('gulp');
var path = require('path');

var protractor = require('gulp-protractor').protractor;
var webdriver_standalone = require('gulp-protractor').webdriver_standalone;
var webdriver_update = require('gulp-protractor').webdriver_update;

var Server = require('karma').Server;

// Run karma tests
gulp.task('test', function(callback) {
  new Server({
    singleRun: true,
    configFile: path.resolve('karma.conf.js')
  }, callback).start();
});

gulp.task('tdd', function (callback) {
  new Server({
    configFile: path.resolve('karma.conf.js')
  }, callback).start();
});

// End to end with Protractor
gulp.task('webdriver_update', webdriver_update);
gulp.task('webdriver_standalone', webdriver_standalone);

gulp.task('e2e', ['webdriver_update'], function(callback) {
  gulp.src(path.join(config.paths.tests, 'e2e/**/*.{js,coffee}'))
    .pipe(protractor({
      configFile: path.resolve('protractor.conf.js'),
      args: ['--baseUrl', 'http://localhost:' + config.browserSync.port]
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    })
    .on('end', function () {
      callback();
    });
});

module.exports = function(){};
