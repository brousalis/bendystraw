'use strict';

var util = require('../util');

var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');
var $ = require('gulp-load-plugins')();

// This does a lot.
// - Uses ngAnnotate to correct the syntax of the Angular dependency injection
// - Minifies javascript files
// - Minifies css
// - Uses useref to concat files into bundles using build: syntax in html
// - Cachebusting for all assets using rev
// - Minifies html files
// - Copies all files into the build folder
// - Prints out sizes of compiled files
function build() {
  util.log('building app');

  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src(path.join(config.paths.tmp, '/serve/*.html'))
    .pipe(assets = $.useref.assets())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify()).on('error', util.errorHandler('uglify'))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(htmlFilter)
    .pipe($.preprocess({ context: { NODE_ENV: 'production' } }))
    .pipe($.minifyHtml(config.settings.minifyHtml))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(path.join(config.paths.dest, '/')))
    .pipe($.gzip())
    .pipe(gulp.dest(path.join(config.paths.dest, '/')))
    .pipe($.size({ title: path.join(config.paths.dest, '/'), showFiles: true }));
}

gulp.task('compile', ['inject'], build);

// Builds the app to be deployed to production.
gulp.task('build', function(callback) {
  runSequence('clean', ['compile', 'images:build', 'fonts', 'other'], callback);
});

module.exports = build;
