'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('inject', ['scripts', 'styles'], function () {
  var injectStyles = gulp.src([
    path.join(config.paths.tmp, '/serve/app/**/*.css')
    // path.join('!' + config.paths.tmp, '/serve/app/vendor.css')
  ], { read: false });

  var injectScripts = gulp.src([
    path.join(config.paths.src, '/app/**/*.module.js'),
    path.join(config.paths.src, '/app/**/*.js'),
    path.join(config.paths.tmp, '/serve/app/**/*.module.js'),
    path.join(config.paths.tmp, '/serve/app/**/*.js'),
    path.join('!' + config.paths.src, '/app/**/*.spec.js'),
    path.join('!' + config.paths.src, '/app/**/*.mock.js')
  ])
  .pipe($.angularFilesort()).on('error', config.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [config.paths.src, path.join(config.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(config.paths.src, '/*.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, config.wiredep)))
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve')));
});
