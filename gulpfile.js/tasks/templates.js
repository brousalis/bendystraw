'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

// Takes the compiled html files, minifys them, then adds them to the
// Angular template cache file.
gulp.task('templates', ['markup'], function () {
  return gulp.source([
    path.join(config.paths.src, config.paths.scripts, '/**/*.html'),
    path.join(config.paths.tmp, '/serve', config.paths.scripts, '/**/*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: config.settings.module,
      root: config.paths.scripts
    }))
    .pipe(gulp.dest(config.paths.tmp + '/templates/'));
});

// Compiles Jade files to html files
gulp.task('markup', function() {
  function renameToHtml(path) {
    path.extname = '.html';
  }

  return gulp.source(path.join(config.paths.src, config.paths.scripts, '/**/*.jade'))
    .pipe($.changed(path.join(config.paths.tmp, '/serve', config.paths.scripts), {extension: '.html'}))
    .pipe($.consolidate('jade')).on('error', config.errorHandler('Jade'))
    .pipe($.rename(renameToHtml))
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve', config.paths.scripts)))
    .pipe(browserSync.reload({ stream: true }));
});
