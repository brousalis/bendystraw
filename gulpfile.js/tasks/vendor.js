'use strict';

var path = require('path');

var gulp = require('gulp');
var filter = require('gulp-filter');

// Used for non-Bower third party libraries
function vendor() {
  return gulp.src([
    path.join(config.paths.src, config.paths.vendor, '/**/*.js'),
    path.join(config.paths.src, config.paths.vendor, '/**/*.css'),
  ])
    .pipe(gulp.dest(path.join(config.paths.tmp, config.paths.vendor)));
}

// Used for custom fonts, folders, files in the other folders, etc...
function other() {
  var fileFilter = filter(function (file) {
    return file.stat.isFile();
  });

  // This isn't a very good way of doing this :(
  return gulp.src([
    path.join(config.paths.src, '/**/*'),
    path.join('!' + config.paths.src, '/**/*.{' + config.extensions.styles.join(',') + '}'),
    path.join('!' + config.paths.src, '/**/*.{' + config.extensions.scripts.join(',') + '}'),
    path.join('!' + config.paths.src, '/**/*.{' + config.extensions.templates.join(',') + '}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(config.paths.tmp, '/')));
}

gulp.task('other', other);
gulp.task('vendor', ['other'], vendor);

module.exports = vendor;
