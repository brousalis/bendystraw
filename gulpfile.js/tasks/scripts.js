'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('scripts', function () {
  return gulp.src(path.join(config.paths.src, '/app/**/*.coffee'))
    .pipe($.sourcemaps.init())
    // .pipe($.coffeelint())
    // .pipe($.coffeelint.reporter())
    .pipe($.coffee()).on('error', config.errorHandler('CoffeeScript'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve/app')))
    .pipe(browserSync.reload({ stream: true }))
    .pipe($.size())
});
