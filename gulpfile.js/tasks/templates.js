'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

// Takes the compiled html files, minifys them, then adds them to the
// Angular template cache file.
gulp.task('templates', ['markups'], function () {
  return gulp.src([
    path.join(config.paths.src, '/app/**/*.html'),
    path.join(config.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'wccApp',
      root: 'app'
    }))
    .pipe(gulp.dest(config.paths.tmp + '/templates/'));
});

// Compiles Jade files to html files
gulp.task('markups', function() {
  function renameToHtml(path) {
    path.extname = '.html';
  }

  return gulp.src(path.join(config.paths.src, '/app/**/*.jade'))
    .pipe($.consolidate('jade')).on('error', config.errorHandler('Jade'))
    .pipe($.rename(renameToHtml))
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve/app/')))
    .pipe(browserSync.reload({ stream: true }));
});
