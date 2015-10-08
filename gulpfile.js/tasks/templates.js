'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

// Takes the compiled html files, minifys them, then adds them to the Angular template cache file.
gulp.task('templates', ['markup'], function () {
  return gulp.src([
    path.join(config.paths.src, config.paths.scripts, '/**/*.html'),
    path.join(config.paths.tmp, '/serve', config.paths.scripts, '/**/*.html')
  ])
    .pipe($.minifyHtml({ empty: true, spare: true, quotes: true }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: config.settings.module,
      root: config.paths.scripts
    }))
    .pipe(gulp.dest(config.paths.tmp + '/templates/'));
});

// Compiles changed html files to the dev folder
gulp.task('markup', function() {
  var dest = path.join(config.paths.tmp, '/serve', config.paths.scripts)

  return gulp.src(path.join(config.paths.src, config.paths.scripts, '/**/*.html'))
    .pipe($.changed(dest, {extension: '.html'}))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({ stream: true }));
});
