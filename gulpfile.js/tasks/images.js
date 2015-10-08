var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
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

// Force optimize all images on the build
gulp.task('build-images', function () {
  return gulp.src(path.join(config.paths.src, config.paths.images, '/**'))
    .pipe($.imagemin(config.settings.imagemin))
    .pipe(gulp.dest(path.join(config.paths.dest, config.paths.images)))
});
