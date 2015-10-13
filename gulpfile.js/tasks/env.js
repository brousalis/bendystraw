'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var gulpNgConfig = require('gulp-ng-config');
var $ = require('gulp-load-plugins')();

// Creates a config.js Angular config module from env file
gulp.task('config', function() {
  return gulp.src(config.path.env)
    .pipe(gulpNgConfig('env', {
      environment: process.env['NODE_ENV'],
      constants: { NODE_ENV: process.env['NODE_ENV'] }
    }))
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve', config.paths.scripts)))
});

gulp.task('set-development', function() {
  return process.env.NODE_ENV = 'development';
});

gulp.task('set-staging', function() {
  return process.env.NODE_ENV = 'staging';
});

gulp.task('set-production', function() {
  return process.env.NODE_ENV = 'production';
});
