'use strict';

var path = require('path');

var gulp = require('gulp');
var filter = require('gulp-filter');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');

// If /images/ is in the path for a bower_component image, strip it out
// to avoid duplication
function imageFolder(path) {
  var imagesFolder = path.dirname.split(config.paths.images)[1];
  if (imagesFolder) path.dirname = imagesFolder;
  return path;
}

// Move all of the images from bower components into the dev images folder
// This is used by `inject`
gulp.task('images', function(callback) {
  return gulp.src(config.bowerImages)
    .pipe(filter('**/*.{' + config.extensions.images.join(',') + '}'))
    .pipe(rename(imageFolder))
    .pipe(gulp.dest(path.join(config.paths.tmp, config.paths.images)));
});

// Dev task for optimizing images in your source folder
gulp.task('images:optimize', function(callback) {
  return gulp.src(path.join(config.paths.src, config.paths.images, '**/*'))
    .pipe(imagemin(config.images))
    .pipe(gulp.dest(path.join(config.paths.src, config.paths.images)));
});

// Optimize all images and put in the build folder
function buildImages() {
  return gulp.src(path.join(config.paths.src, config.paths.images, '**/*'))
    .pipe(imagemin(config.images))
    .pipe(gulp.dest(path.join(config.paths.dest, config.paths.images)));
}

// Grab images from bower_components, optimize them, then put them in the build folder
// This is only used in the final build
function buildBowerImages() {
  return gulp.src(config.bowerImages)
    .pipe(filter('**/*.{' + config.extensions.images.join(',') + '}'))
    .pipe(rename(imageFolder))
    .pipe(gulp.dest(path.join(config.paths.dest, config.paths.images)));
}

// Prepares all of the images for the build. Makes sure bower_component images have been
// optimized and moved into build folder, then does the rest of the images.
gulp.task('images:build', function(callback) {
  buildBowerImages();
  buildImages();
  callback();
});

module.exports = function(){};
