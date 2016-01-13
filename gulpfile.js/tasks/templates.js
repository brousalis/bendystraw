'use strict';

var path = require('path');

var gulp = require('gulp');
var browserSync = require('browser-sync');
var minifyHtml = require('gulp-minify-html');
var angularTemplatecache = require('gulp-angular-templatecache');
var changed = require('gulp-changed');
var preprocess = require('gulp-preprocess');

// Takes the compiled html files, minifys them, then adds them to the Angular template cache file.
gulp.task('templates', ['markup'], function(callback) {
  return gulp.src(path.join(config.paths.tmp, config.paths.scripts, '/**/*.html'))
    .pipe(minifyHtml(config.html))
    .pipe(angularTemplatecache('templates.js', {
      module: config.templateModule,
      root: config.paths.scripts,
      standalone: true
    }))
    .pipe(gulp.dest(path.join(config.paths.tmp, '/templates')))
    .pipe(browserSync.reload({ stream: true }));
});

// Compiles changed html files to the dev folder
gulp.task('markup', function(callback) {
  var dest = path.join(config.paths.tmp, config.paths.scripts);

  return gulp.src(path.join(config.paths.src, config.paths.scripts, '/**/*.html'))
    .pipe(changed(dest, { extension: '.html' }))
    .pipe(preprocess({ context: { NODE_ENV: process.env.NODE_ENV } }))
    .pipe(gulp.dest(dest));
});

module.exports = function(){};
