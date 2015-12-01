'use strict';

var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')();

// Used for non-Bower third party libraries
function vendor() {
  return gulp.src(path.join(config.paths.src, config.paths.vendor, '/**/*.js'))
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve', config.paths.vendor)))
}

// Used for custom fonts, folders, files in the other folders, etc...
function other() {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  // This isn't a very good way of doing this :(
  return gulp.src([
    path.join(config.paths.src, '/**/*'),
    path.join('!' + config.paths.src, '/**/*.{html,haml,jade,css,sass,styl,scss,js,coffee,' + config.settings.images.join(',') + '}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(config.paths.dest, '/')));
};

gulp.task('other', other);
gulp.task('vendor', vendor);

module.exports = vendor;
