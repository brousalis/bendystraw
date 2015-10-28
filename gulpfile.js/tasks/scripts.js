'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var util = require('../util');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

// Compiles coffeescript files to javascript files, creates sourcemaps
gulp.task('scripts', function () {
  var dest = path.join(config.paths.tmp, '/serve', config.paths.scripts);

  return gulp.src(path.join(config.paths.src, config.paths.scripts, '/**/*.coffee'))
    .pipe($.changed(dest, { extension: '.js' }))
    .pipe($.sourcemaps.init())
    .pipe($.coffee()).on('error', util.errorHandler('coffeescript'))
    .pipe($.ngAnnotate())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({ stream: true }));
});
