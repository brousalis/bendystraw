'use strict';

var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')();

// If /images/ is in the path for a bower_component image, strip it out
// to avoid duplication
function imageFolder(path) {
  var imagesFolder = path.dirname.split(config.paths.images)[1];
  if (imagesFolder) path.dirname = imagesFolder;
  return path;
}

// Move all of the images from bower components into the dev images folder
gulp.task('images', function() {
  var dest = path.join(config.paths.tmp, '/serve', config.paths.images);

  return gulp.src(config.settings.images)
    .pipe($.filter('**/*.{' + config.extensions.images.join(',') + '}'))
    .pipe($.rename(imageFolder))
    .pipe(gulp.dest(dest));
});

// Optimize all images (including those from bower) and put in the build folder
gulp.task('images:build', ['images:bower'], function () {
  var dest = path.join(config.paths.dest, config.paths.images);
  return gulp.src(path.join(config.paths.src, config.paths.images, '**/*'))
    .pipe($.imagemin(config.settings.imagemin))
    .pipe(gulp.dest(dest));
});

// Grab images from bower_components, optimize them, then put them in the build folder
// This is only used in the final build
gulp.task('images:bower', function() {
  var dest = path.join(config.paths.dest, config.paths.images);

  return gulp.src(config.settings.images)
    .pipe($.filter('**/*.{' + config.extensions.images.join(',') + '}'))
    .pipe($.rename(imageFolder))
    .pipe(gulp.dest(dest));
});

// Dev task for optimizing images in your source folder
gulp.task('images:optimize', function() {
  var dest = path.join(config.paths.src, config.paths.images);
  var cache = path.join(config.paths.tmp, 'cache');

  return gulp.src(path.join(config.paths.src, config.paths.images, '**/*'))
    .pipe($.changed(cache))
    .pipe($.imagemin(config.settings.imagemin))
    .pipe(gulp.dest(cache))
    .pipe(gulp.dest(dest));
});

module.exports = function(){};
