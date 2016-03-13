'use strict';

var util = require('../util');

var path = require('path');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var browserSync = require('browser-sync').get('server');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

// Compile the Sass files and autoprefix them
function styles() {
  var dest = path.join(config.paths.tmp, config.paths.styles);

  return gulp.src(path.join(config.paths.src, config.paths.styles, '**/*.{' + config.extensions.styles + '}'))
    .pipe(gulpif(config.sass.sourcemaps, sourcemaps.init()))
    .pipe(gulpif(config.sass.enabled, sass(config.sass.compiler)))
    .on('error', util.errorHandler('sass'))
    .pipe(gulpif(config.sass.autoprefixer, autoprefixer()))
    .on('error', util.errorHandler('autoprefixer'))
    .pipe(gulpif(config.sass.sourcemaps, sourcemaps.write()))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream({match: "**/*.css"}));
}

gulp.task('styles', styles);

module.exports = styles;
