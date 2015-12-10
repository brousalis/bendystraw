'use strict';

var util = require('../util');

var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

// Compiles coffeescript files to javascript files, creates sourcemaps
function scripts() {
  var dest = path.join(config.paths.tmp, config.paths.scripts);

  return gulp.src(path.join(config.paths.src, config.paths.scripts, '/**/*.coffee'))
    .pipe($.changed(dest, { extension: '.js' }))
    .pipe($.sourcemaps.init())
    .pipe($.coffee()).on('error', util.errorHandler('coffeescript'))
    .pipe($.ngAnnotate())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({ stream: true }));
}

gulp.task('scripts', scripts);

module.exports = scripts;
