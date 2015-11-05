'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var path = require('path');
var util = require('../util');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')();

// Injects compiled CSS/JS/HTML files into the main index page using gulp-inject
// Also uses wiredep to include libs from bower_components
gulp.task('inject', ['scripts', 'scripts:vendor', 'styles', 'templates', 'env', 'images:copy'], function () {

  var injectStyles = gulp.src([
    path.join(config.paths.tmp, '/serve', config.paths.scripts, '/**/*.css')
  ], { read: false });

  var injectStylesOptions = {
    ignorePath: [config.paths.src, path.join(config.paths.tmp, '/serve')],
    addRootSlash: false
  };

  // Sort the JS files so Angular dependency injection doesn't freak out
  var injectScripts = gulp.src([
    path.join(config.paths.src, config.paths.scripts, '/**/*.js'),
    path.join(config.paths.tmp, '/serve/', config.paths.scripts, '/**/*.js'),
    path.join('!' + config.paths.src, config.paths.scripts, '/**/*.spec.js'),
    path.join('!' + config.paths.src, config.paths.scripts, '/**/*.mock.js'),
    path.join('!' + config.paths.tmp, '/serve/', config.paths.scripts, '/**/*.spec.js'),
    path.join('!' + config.paths.src, config.paths.vendor)
  ])
  .pipe($.angularFilesort())
  .on('error', util.errorHandler('angularFilesort'));

  var injectScriptsOptions = {
    ignorePath: [config.paths.src, path.join(config.paths.tmp, '/serve')],
    addRootSlash: false
  };

  // Non bower third party templates
  var injectVendor = gulp.src(path.join(config.paths.src, config.paths.vendor), { read: false });
  var injectVendorOptions = {
    starttag: '<!-- inject:vendor -->',
    addRootSlash: false
  };

  return gulp.src(path.join(config.paths.src, '/*.html'))
    .pipe(gulpif(util.fileExists('bower.json'), wiredep({ directory: 'bower_components' })))
    .on('error', util.errorHandler('wiredep'))
    .pipe($.inject(injectStyles, injectStylesOptions))
    .pipe($.inject(injectScripts, injectScriptsOptions))
    .pipe($.inject(injectVendor, injectVendorOptions))
    .pipe($.preprocess({ context: { NODE_ENV: process.env['NODE_ENV'] } }))
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve')));
});

module.exports = function(){};
