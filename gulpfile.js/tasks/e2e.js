'use strict';

var util = require('../util');

var gulp = require('gulp');
var path = require('path');

var browserSync = require('browser-sync');
var protractor = require('gulp-protractor').protractor;
var webdriver_standalone = require('gulp-protractor').webdriver_standalone;
var webdriver_update = require('gulp-protractor').webdriver_update;

// End to end with Protractor
gulp.task('webdriver_update', webdriver_update);
gulp.task('webdriver_standalone', webdriver_standalone);

gulp.task('e2e', ['webdriver_update', 'browsersync'], function(callback) {

  if (!browserSync.get('server').active) {
    util.errorHandler('e2e')(new Error('browsersync server failed to run.'));
    return;
  }

  gulp.src(path.join(config.paths.tests, config.paths.e2e, '/**/*.{' + config.extensions.scripts + '}'))
    .pipe(protractor({
      configFile: path.resolve('protractor.conf.js'),
      args: ['--baseUrl', config.test.protractor.baseUrl + ':' + config.browserSync.port]
    }))
    .on('error', util.errorHandler('protractor'))
});

module.exports = function(){};
