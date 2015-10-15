'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var $ = require('gulp-load-plugins')();

// Optimize all images (including those from bower) and put in the build folder
gulp.task('images', ['images:bower'], function () {
  var dest = path.join(config.paths.dest, config.paths.images);
  return gulp.src(path.join(config.paths.src, config.paths.images, '/**/*'))
    .pipe($.changed(dest))
    .pipe($.imagemin(config.settings.imagemin))
    .pipe(gulp.dest(dest));
});

// If /images/ is in the path for a bower_component image, strip it out
function imageFolder(path) {
  var imagesFolder = path.dirname.split(config.paths.images)[1];
  if(imagesFolder) path.dirname = imagesFolder;
  return path;
};

// Grab images from bower_components, optimize them, then put them in the build folder
// This is only used in the final build
gulp.task('images:bower', function() {
  var dest = path.join(config.paths.dest, config.paths.images);

  return gulp.src(config.settings.images)
    .pipe($.filter('**/*.{' + config.extensions.images.join(',') + '}'))
    .pipe($.rename(imageFolder))
    .pipe($.changed(dest))
    .pipe($.imagemin(config.settings.imagemin))
    .pipe(gulp.dest(dest));
});

// Move all of the images from bower components into the dev images folder
gulp.task('images:copy', function() {
  var dest = path.join(config.paths.tmp, '/serve', config.paths.images);

  return gulp.src(config.settings.images)
    .pipe($.filter('**/*.{' + config.extensions.images.join(',') + '}'))
    .pipe($.rename(imageFolder))
    .pipe($.changed(dest))
    .pipe($.imagemin(config.settings.imagemin))
    .pipe(gulp.dest(dest));
});

// Dev task for optimizing images in your source folder
gulp.task('images:optimize', function() {
  var images = path.join(config.paths.src, config.paths.images, '/**');

  return gulp.src(images)
    .pipe($.changed(images))
    .pipe($.imagemin(config.settings.imagemin))
    .pipe(gulp.dest(images));
});
