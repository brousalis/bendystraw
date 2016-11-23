'use strict';

var util = require('../util');
var mvmkdir = require('../lib/mvmkdir');

var path = require('path');
var exec = require('child_process').exec;

var _ = require('lodash');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var size = require('gulp-size');
var runSequence = require('run-sequence');
var filter = require('gulp-filter');
var ngAnnotate = require('gulp-ng-annotate');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var minifyHtml = require('gulp-minify-html');
var preprocess = require('gulp-preprocess');
var gzip = require('gulp-gzip');
var zip = require('gulp-zip');

// Custom build folder, useful for deployments to a sub folder
function folder() {
  var dest = config.paths.build

  if (_.isString(config.build.folder)) dest = config.build.folder;
  if (_.isFunction(config.build.folder)) dest = config.build.folder();

  // Some fun with SHAs
  if (config.build.folder === 'sha') {
    var exec = require('child_process').exec;
    var git = exec(
      'git rev-parse HEAD',
      function (err, stdout, stderr) {
        dest = stdout.split('\n').join('');

        util.log('Moving app into ' + gutil.colors.yellow(path.join(config.paths.build, dest)));

        mvmkdir(dest, function() {
          return true;
        });
      }
    );
  } else {
    util.log('Moving app into ' + gutil.colors.yellow(path.join(config.paths.build, dest)));

    mvmkdir(dest, function() {
      return true;
    });
  }
}

gulp.task('folder', folder);

// Compiles, minifies, file injection, asset revisioning.
function compile(callback) {
  var htmlFilter = filter('*.html');
  var jsFilter = filter('**/*.js');
  var cssFilter = filter('**/*.css');
  var assets;

  return gulp.src(path.join(config.paths.dev, '*.html'))
    .pipe(assets = useref.assets())
    .pipe(jsFilter)
    .pipe(gulpif(config.angular.enabled, ngAnnotate()))
    .pipe(uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(cleanCSS())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(htmlFilter)
    .pipe(preprocess({ context: { NODE_ENV: 'production' } }))
    .pipe(gulpif(config.html.minify, minifyHtml(config.html)))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(path.join(config.paths.build, '/')))
    .pipe(gulpif(config.build.gzip, gzip()))
    .pipe(gulp.dest(path.join(config.paths.build, '/')))
    .pipe(gulpif(config.build.archive, zip('build.zip')))
    .pipe(gulp.dest(path.join(config.paths.build, '/')))
    // .pipe(gulpif(config.build.folder, folder(callback)))
}

gulp.task('compile', compile);

gulp.task('size', function(callback) {
  return gulp.src(path.join(config.paths.build, '**/*'))
    .pipe(size({ title: 'build', showFiles: true }))
});

// Builds the app to be deployed to production.
gulp.task('build', function(callback) {
  util.log('Building app in ' + gutil.colors.yellow(process.env.NODE_ENV) + ' environment');

  runSequence(
    'clean',
    ['misc:build', 'images:build'],
    'inject',
    'compile',
    'size',
    function() {
      if (config.build.folder) {
        folder();
      }
    }
  );
});

module.exports = compile;
