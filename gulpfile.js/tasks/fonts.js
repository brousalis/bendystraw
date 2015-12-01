'use strict';

var util = require('../util');

var gulp = require('gulp');
var path = require('path');
var mainBowerFiles = require('main-bower-files');
var $ = require('gulp-load-plugins')();

// Only applies to fonts from bower dependencies
// Custom fonts are handled by the "other" task
function fonts() {
  if(!util.fileExists('bower.json')) return;

  return gulp.src(mainBowerFiles())
    .pipe($.filter('**/*.{' + config.extensions.fonts.join(',') + '}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(config.paths.dest, '/fonts/')));
}

gulp.task('fonts', fonts);

module.exports = fonts;
