'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

// Compiles coffeescript files to javascript files, creates sourcemaps
gulp.task('scripts', function () {
  return gulp.src(path.join(config.paths.src, config.paths.scripts, '/**/*.coffee'))
    .pipe($.sourcemaps.init())
    // .pipe($.coffeelint())
    // .pipe($.coffeelint.reporter())
    .pipe($.coffee()).on('error', config.errorHandler('CoffeeScript'))
    .pipe($.ngAnnotate())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve', config.paths.scripts)))
    .pipe(browserSync.reload({ stream: true }))
    .pipe($.size())
});
