'use strict';

var util = require('../util');

var path = require('path');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var wiredep = require('wiredep').stream;
var ginject = require('gulp-inject');
var preprocess = require('gulp-preprocess');
var angularFilesort = require('gulp-angular-filesort');

// Injects compiled CSS/JS/HTML files into the main index page using gulp-inject
// Also uses wiredep to include libs from bower_components
function inject(callback) {
  var injectStyles = gulp.src([
    path.join(config.paths.tmp, config.paths.scripts, '/**/*.css')
  ], { read: false });

  var injectStylesOptions = {
    ignorePath: [config.paths.src, path.join(config.paths.tmp)],
    addRootSlash: false
  };

  // Sort the JS files so Angular dependency injection doesn't freak out
  var injectScripts = gulp.src([
    path.join(config.paths.src, config.paths.scripts, '/**/*.js'),
    path.join(config.paths.tmp, config.paths.scripts, '/**/*.js'),
    path.join('!' + config.paths.src, config.paths.scripts, '/**/*.spec.js'),
    path.join('!' + config.paths.src, config.paths.scripts, '/**/*.mock.js'),
    path.join('!' + config.paths.tmp, config.paths.scripts, '/**/*.spec.js'),
    path.join('!' + config.paths.tmp, config.paths.scripts, '/**/*.mock.js'),
    path.join('!' + config.paths.src, config.paths.vendor)
  ])
  .pipe(angularFilesort())
  .on('error', util.errorHandler('angularFilesort'));

  var injectScriptsOptions = {
    ignorePath: [config.paths.src, config.paths.tmp],
    addRootSlash: false
  };

  // Non Bower third party templates
  var injectVendor = gulp.src(path.join(config.paths.tmp, config.paths.vendor, '/**/*.js'), { read: false });
  var injectVendorOptions = {
    starttag: '<!-- inject:vendor -->',
    ignorePath: [config.paths.src, config.paths.tmp],
    addRootSlash: false
  };

  // Angular templateCache injection into index.html
  var injectTemplates = gulp.src(path.join(config.paths.tmp, '/templates/templates.js'), { read: false });
  var injectTemplatesOptions = {
    starttag: '<!-- inject:templates -->',
    ignorePath: [config.paths.src, config.paths.tmp],
    addRootSlash: false
  };

  return gulp.src(path.join(config.paths.src, '/*.html'))
    .pipe(gulpif(util.fileExists('bower.json'), wiredep({ directory: 'bower_components' })))
    .on('error', util.errorHandler('wiredep'))
    .pipe(ginject(injectTemplates, injectTemplatesOptions))
    .pipe(ginject(injectStyles, injectStylesOptions))
    .pipe(ginject(injectVendor, injectVendorOptions))
    .pipe(ginject(injectScripts, injectScriptsOptions))
    .pipe(preprocess({ context: { NODE_ENV: process.env.NODE_ENV } }))
    .pipe(gulp.dest(config.paths.tmp));
}

gulp.task('inject', ['scripts', 'vendor', 'styles', 'templates', 'env', 'images'], inject);

module.exports = inject;
