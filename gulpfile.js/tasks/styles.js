'use strict';

var util = require('../util');
var _ = require('lodash');

var path = require('path');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var browserSync = require('browser-sync').get('server');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var autoprefixer = require('gulp-autoprefixer');
var cmq = require('gulp-combine-mq');
var uncss = require('gulp-uncss');

// Compile the Sass files and autoprefix them
function styles() {
  var dest = path.join(config.paths.dev, config.paths.styles);

  return gulp.src(path.join(config.paths.src, config.paths.styles, '**/*.{' + config.extensions.styles + '}'))
    .pipe(gulpif(config.styles.sourcemaps, sourcemaps.init()))
    .pipe(gulpif(config.styles.sass, sassGlob()))
    .pipe(gulpif(config.styles.sass, sass(config.styles.sassOptions)))
    .on('error', util.errorHandler('sass'))
    .pipe(gulpif(config.styles.autoprefixer, autoprefixer()))
    .pipe(gulpif(config.styles.combineMediaQueries, cmq()))
    .pipe(gulpif(config.styles.uncss, uncss(_.merge({ html: [ path.join(config.paths.dev, '**/*.html') ] }, config.styles.uncssOptions))))
    .pipe(gulpif(config.styles.sourcemaps, sourcemaps.write()))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream({match: "**/*.css"}));
}

gulp.task('styles', styles);

module.exports = styles;
