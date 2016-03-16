'use strict';

var path = require('path');

var gulp = require('gulp');
var filter = require('gulp-filter');

// Used for custom fonts, folders, files in the other folders, etc...
function misc(dest) {
  var fileFilter = filter(function (file) {
    return file.stat.isFile();
  });

  // This isn't a very good way of doing this :(
  return gulp.src([
    path.join(config.paths.src, '/**/*'),
    path.join('!' + config.paths.src, config.paths.styles, '/**/*'),
    path.join('!' + config.paths.src, config.paths.scripts, '/**/*'),
    path.join('!' + config.paths.src, config.paths.vendor, '/**/*')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(dest, '/')));
}

gulp.task('misc', function(callback) {
  misc(config.paths.tmp);
  callback();
});

gulp.task('misc:build', function(callback) {
  misc(config.paths.dest);
  callback();
});

module.exports = misc;
