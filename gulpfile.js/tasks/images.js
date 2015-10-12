'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

// Get images ready for the build
gulp.task('images', ['images:bower'], function () {
  return gulp.src(path.join(config.paths.src, config.paths.images, '/**'))
    .pipe($.imagemin(config.settings.imagemin))
    .pipe(gulp.dest(path.join(config.paths.dest, config.paths.images)))
});

// Dev task for optimizing images
gulp.task('images:optimize', function() {
  var dest = path.join(config.paths.tmp, '/serve', config.paths.images)

  return gulp.src(path.join(config.paths.src, config.paths.images, '/**'))
    .pipe($.changed(dest))
    .pipe($.imagemin(config.settings.imagemin))
    .pipe(gulp.dest(dest))
});

// Move all of the images from bower components into the dev images folder
gulp.task('images:copy', function() {
  return gulp.src('./bower_components/**/*')
    .pipe($.filter('**/*.{' + config.settings.images.join(',') + '}'))
    .pipe($.rename(function (path) {
      path.dirname = "" + path.dirname.split(config.paths.images)[1]
      return path;
    }))
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve', config.paths.images)));
});

// Grab images from bower_components, optimize them, then put them in the build folder
// This is only used in the final build
gulp.task('images:bower', function() {
  return gulp.src('./bower_components/**/*')
    .pipe($.filter('**/*.{' + config.settings.images.join(',') + '}'))
    .pipe($.filter(config.settings.imageFilter))
    .pipe($.imagemin(config.settings.imagemin))
    .pipe($.rename(function (path) {
      path.dirname = "" + path.dirname.split(config.paths.images)[1]
      return path;
    }))
    .pipe(gulp.dest(path.join(config.paths.dest, config.paths.images)));
});
