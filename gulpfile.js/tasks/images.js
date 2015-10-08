var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
var mainBowerFiles = require('main-bower-files');
var $ = require('gulp-load-plugins')();

// Dev task for optimizing images
gulp.task('images', function() {
  var dest = path.join(config.paths.tmp, '/serve', config.paths.images)

  return gulp.src(path.join(config.paths.src, config.paths.images, '/**'))
    .pipe($.changed(dest))
    .pipe($.imagemin(config.settings.imagemin))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({stream:true}))
})

// Force optimize all images for the build
gulp.task('images:build', ['images:bower:build'], function () {
  return gulp.src(path.join(config.paths.src, config.paths.images, '/**'))
    .pipe($.imagemin(config.settings.imagemin))
    .pipe(gulp.dest(path.join(config.paths.dest, config.paths.images)))
});

// Grab images from bower_components, optimize them, then put them in the build folder
gulp.task('images:bower:build', function() {
  return gulp.src('./bower_components/**/*')
    .pipe($.filter('**/*.{' + config.settings.images.join(',') + '}'))
    .pipe($.filter(config.settings.imageFilter))
    .pipe($.imagemin(config.settings.imagemin))
    .pipe($.rename(function (path) {
      path.dirname = path.dirname.split(config.paths.images)[1]
      return path;
    }))
    .pipe(gulp.dest(path.join(config.paths.dest, config.paths.images)));
});

// Move all of the images from bower components into the dev images folder
gulp.task('images:bower', function() {
  return gulp.src('./bower_components/**/*')
    .pipe($.filter('**/*.{' + config.settings.images.join(',') + '}'))
    .pipe($.rename(function (path) {
      path.dirname = path.dirname.split(config.paths.images)[1]
      return path;
    }))
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve', config.paths.images)));
});
