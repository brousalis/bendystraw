'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var path = require('path');
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

  return gulp.src([path.join(config.paths.src, config.paths.styles, '/*.{sass,scss}')])
    .pipe(plumber())
    .pipe(gulpif(util.fileExists('bower.json'), wiredep({ directory: 'bower_components' })))
    .on('error', util.errorHandler('wiredep'))
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions)).on('error', util.errorHandler('sass'))
    .pipe($.autoprefixer()).on('error', util.errorHandler('autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve', config.paths.scripts)))
    .pipe(browserSync.stream());
});

module.exports = function(){};
