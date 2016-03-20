'use strict';

var util = require('../util');

var path = require('path');

var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var flatten = require('gulp-flatten');

// Only applies to fonts from bower dependencies
// Custom fonts are handled by the "other" task
function fonts(callback) {
  if (!util.fileExists('bower.json')) return;

  return gulp.src(mainBowerFiles())
    .pipe(filter('**/*.{' + config.extensions.fonts.join(',') + '}'))
    .pipe(flatten())
    .pipe(gulp.dest(path.join(config.paths.dest, config.paths.fonts)));
}

gulp.task('fonts:build', fonts);

module.exports = fonts;
