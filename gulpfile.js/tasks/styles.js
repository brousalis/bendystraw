'use strict';

var util = require('../util');

var path = require('path');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var wiredep = require('wiredep').stream;
var browserSync = require('browser-sync').get('server');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

// Compile the Sass files and autoprefix them
function styles() {
  var dest = path.join(config.paths.tmp, config.paths.styles);

  return gulp.src(path.join(config.paths.src, config.paths.styles, '/*.{sass,scss}'))
    // .pipe(gulpif(util.fileExists('bower.json'), wiredep({ directory: 'bower_components' })))
    // .on('error', util.errorHandler('wiredep'))
    .pipe(sourcemaps.init())
    .pipe(sass(config.sass)).on('error', util.errorHandler('sass'))
    .pipe(autoprefixer()).on('error', util.errorHandler('autoprefixer'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream({match: "**/*.css"}));
}

gulp.task('styles', styles);

module.exports = styles;
