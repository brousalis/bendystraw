'use strict';

var util = require('../util');
var path = require('path');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var filter = require('gulp-filter');
var ngAnnotate = require('gulp-ng-annotate');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var preprocess = require('gulp-preprocess');
var gzip = require('gulp-gzip');
var zip = require('gulp-zip');

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
  var htmlFilter = filter('*.html');
  var jsFilter = filter('**/*.js');
  var cssFilter = filter('**/*.css');
  var assets;

  return gulp.src(path.join(config.paths.tmp, '*.html'))
    .pipe(assets = useref.assets())
    .pipe(jsFilter)
    .pipe(gulpif(config.angular.enabled, ngAnnotate()))
    .pipe(uglify()).on('error', util.errorHandler('uglify'))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(minifyCss())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(htmlFilter)
    .pipe(preprocess({ context: { NODE_ENV: 'production' } }))
    .pipe(minifyHtml(config.html))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(path.join(config.paths.dest, '/')))
    .pipe(gzip())
    .pipe(gulp.dest(path.join(config.paths.dest, '/')))
    .pipe(zip('build.zip'))
    .pipe(gulp.dest(path.join(config.paths.dest, '/')))
}

gulp.task('compile', ['inject'], build);

// Builds the app to be deployed to production.
gulp.task('build', function(callback) {
  util.log('Building app in ' + gutil.colors.yellow(process.env.NODE_ENV) + ' environment');

  runSequence(
    'clean',
    ['vendor:build', 'misc:build', 'images:build', 'fonts:build'],
    'compile',
    callback
  );
});

module.exports = build;
