'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var addStream = require('add-stream');
var gulpNgConfig = require('gulp-ng-config');
var $ = require('gulp-load-plugins')();

gulp.task('config', function() {
  return gulp.src('./config.json')
    .pipe(gulpNgConfig('config', {environment: process.env['NODE_ENV']}))
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
