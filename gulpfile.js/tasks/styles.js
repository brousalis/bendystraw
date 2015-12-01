'use strict';

var util = require('../util');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var path = require('path');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')();

// Compile the Sass files and autoprefix them
function styles() {
  return gulp.src([path.join(config.paths.src, config.paths.styles, '/*.{sass,scss}')])
    .pipe(plumber())
    .pipe(gulpif(util.fileExists('bower.json'), wiredep({ directory: 'bower_components' })))
    .on('error', util.errorHandler('wiredep'))
    .pipe($.sourcemaps.init())
    .pipe($.sass(config.settings.sass)).on('error', util.errorHandler('sass'))
    .pipe($.autoprefixer()).on('error', util.errorHandler('autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve', config.paths.scripts)))
    .pipe(browserSync.stream());
}

gulp.task('styles', styles);

module.exports = styles;
