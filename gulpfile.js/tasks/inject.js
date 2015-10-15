'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var path = require('path');
var config = require('../config');
var util = require('../util');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')();

// Injects compiled CSS/JS/HTML files into the main index page using gulp-inject
// Also uses wiredep to include libs from bower_components
gulp.task('inject', ['env', 'scripts', 'styles', 'templates', 'images:copy'], function () {
  var injectStyles = gulp.src([
    path.join(config.paths.tmp, '/serve', config.paths.scripts, '/**/*.css')
  ], { read: false });

  // Sort the JS files so Angular dependency injection doesn't freak out
  var injectScripts = gulp.src([
    path.join(config.paths.src, config.paths.scripts, '/**/*.js'),
    path.join(config.paths.tmp, '/serve/', config.paths.scripts, '/**/*.js'),
    path.join('!' + config.paths.src, config.paths.scripts, '/**/*.spec.js'),
    path.join('!' + config.paths.src, config.paths.scripts, '/**/*.mock.js'),
    path.join('!' + config.paths.tmp, '/serve/', config.paths.scripts, '/**/*.spec.js'),
  ])
  .pipe($.angularFilesort())
  .on('error', util.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [config.paths.src, path.join(config.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(config.paths.src, '/*.html'))
    .pipe($.preprocess({ context: { NODE_ENV: process.env['NODE_ENV'] } }))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(gulpif(path.resolve('bower.json') != 'undefined', wiredep({ directory: 'bower_components' })))
    .on('error', util.errorHandler('wiredep'))
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve')));
});
