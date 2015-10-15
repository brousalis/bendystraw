'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var path = require('path');
var config = require('../config');
var util = require('../util');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
  var sassOptions = {
    indentedSyntax: true,
    imagePath: 'images'
  };

  return gulp.src([path.join(config.paths.src, config.paths.styles, '/main.sass')])
    .pipe(plumber())
    .pipe(gulpif(path.resolve('bower.json') != 'undefined', wiredep({ directory: 'bower_components' })))
    .on('error', util.errorHandler('wiredep'))
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions)).on('error', util.errorHandler('Sass'))
    .pipe($.autoprefixer()).on('error', util.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve', config.paths.scripts)))
    .pipe(browserSync.stream());
});
