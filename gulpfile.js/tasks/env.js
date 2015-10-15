'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var util = require('../util');
var gulpNgConfig = require('gulp-ng-config');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

// Creates a config.js Angular config module from env file
gulp.task('env', function() {
  var dest = path.join(config.paths.tmp, '/serve', config.paths.scripts);

  // Gets the config settings for the current NODE_ENV, also stubs that in
  var ngConfig = {
    environment: process.env.NODE_ENV,
    constants: { NODE_ENV: process.env.NODE_ENV }
  };

  return gulp.src(config.paths.env)
    .pipe(gulpNgConfig('env', ngConfig)).on('error', util.errorHandler('ng-config'))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({ stream: true }))
});

// Helpers for setting the NODE_ENV before running a task
gulp.task('set-development', function() {
  return process.env.NODE_ENV = 'development';
});

gulp.task('set-staging', function() {
  return process.env.NODE_ENV = 'staging';
});

gulp.task('set-production', function() {
  return process.env.NODE_ENV = 'production';
});
