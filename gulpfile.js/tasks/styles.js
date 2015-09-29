'use strict';

var util = require('../util');

var path = require('path');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var changed = require('gulp-changed');
var autoprefixer = require('gulp-autoprefixer');

// Compile the Sass files and autoprefix them
function styles() {
  var dest = path.join(config.paths.tmp, config.paths.scripts);

  return gulp.src([path.join(config.paths.src, config.paths.styles, '/*.{sass,scss}')])
    .pipe(changed(dest, { extension: '.css' }))
    // .pipe(gulpif(util.fileExists('bower.json'), wiredep({ directory: 'bower_components' })))
    // .on('error', util.errorHandler('wiredep'))
    .pipe(sourcemaps.init())
    .pipe(sass(config.sass)).on('error', util.errorHandler('sass'))
    .pipe(autoprefixer()).on('error', util.errorHandler('autoprefixer'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
}

gulp.task('styles', styles);

module.exports = styles;
