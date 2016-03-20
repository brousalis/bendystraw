'use strict';

var util = require('../util');

var path = require('path');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var browserSync = require('browser-sync').get('server');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var autoprefixer = require('gulp-autoprefixer');

// Compile the Sass files and autoprefix them
function styles() {
  var dest = path.join(config.paths.dev, config.paths.styles);

  return gulp.src(path.join(config.paths.src, config.paths.styles, '**/*.{' + config.extensions.styles + '}'))
    .pipe(gulpif(config.styles.sourcemaps, sourcemaps.init()))
    .pipe(gulpif(config.styles.sass, sassGlob()))
    .pipe(gulpif(config.styles.sass, sass(config.styles.compiler)))
    .on('error', util.errorHandler('sass'))
    .pipe(gulpif(config.styles.autoprefixer, autoprefixer()))
    .on('error', util.errorHandler('autoprefixer'))
    .pipe(gulpif(config.styles.sourcemaps, sourcemaps.write()))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream({match: "**/*.css"}));
}

gulp.task('styles', styles);

module.exports = styles;
