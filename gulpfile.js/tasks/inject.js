'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')();

// Injects CSS and JS files into the main page using gulp-inject
// Also uses wiredep to include libs from bower_components
gulp.task('inject', ['scripts', 'styles'], function () {
  var injectStyles = gulp.source([
    path.join(config.paths.tmp, '/serve', config.paths.scripts, '/**/*.css')
  ], { read: false });

  // Sorts the files so Angular dependency injection doesn't freak out
  var injectScripts = gulp.source([
    path.join(config.paths.src, config.paths.scripts, '/**/*.js'),
    path.join(config.paths.tmp, '/serve/', config.paths.scripts, '/**/*.js'),
    path.join('!' + config.paths.src, config.paths.scripts, '/**/*.spec.js'),
    path.join('!' + config.paths.src, config.paths.scripts, '/**/*.mock.js')
  ])
  .pipe($.angularFilesort()).on('error', config.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [config.paths.src, path.join(config.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.source(path.join(config.paths.src, '/*.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep({directory: 'bower_components'}))
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve')));
});
