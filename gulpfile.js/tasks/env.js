'use strict';

var gulp = require('gulp');

gulp.task('set-development', function() {
  return process.env.NODE_ENV = 'development';
});

gulp.task('set-staging', function() {
  return process.env.NODE_ENV = 'staging';
});

gulp.task('set-production', function() {
  return process.env.NODE_ENV = 'production';
});
