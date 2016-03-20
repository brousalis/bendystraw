'use strict';

var util = require('../util');
var path = require('path');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var _ = require('lodash');
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

// Custom build folder, useful for deployments to a sub folder
function folder() {
  var dest = config.paths.dest

  if (_.isString(config.build.folder)) dest = config.build.folder;
  if (_.isFunction(config.build.folder)) dest = config.build.folder();

  util.log('Moving app into ' + gutil.colors.yellow(path.join(config.paths.dest, dest)));

  // ¯\_(ツ)_/¯
  var mkdir = spawn(
    'mkdir',
    ['-p', dest],
    {cwd: config.paths.dest }
  );

  mkdir.on('exit', function(code) {
    if (code === 0) {
      // Now move them into the folder we just created
      var mv = exec(
        'mv * ./' + dest,
        {cwd: config.paths.dest },
        function(error, stdout, stderr) {
          return true;
        }
      );
    }
  });
}

gulp.task('folder', folder);

// Compiles, minifies, file injection, asset revisioning.
function compile(callback) {
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
    .pipe(gulpif(config.html.minify, minifyHtml(config.html)))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(path.join(config.paths.dest, '/')))
    .pipe(gulpif(config.build.gzip, gzip()))
    .pipe(gulp.dest(path.join(config.paths.dest, '/')))
    .pipe(gulpif(config.build.archive, zip('build.zip')))
    .pipe(gulp.dest(path.join(config.paths.dest, '/')))
    // .pipe(gulpif(config.build.folder, folder(callback)))
}

gulp.task('compile', compile);

// Builds the app to be deployed to production.
gulp.task('build', function(callback) {
  util.log('Building app in ' + gutil.colors.yellow(process.env.NODE_ENV) + ' environment');

  runSequence(
    'clean',
    ['misc:build', 'images:build', 'fonts:build'],
    'inject',
    'compile',
    function() {
      if (config.build.folder) {
        folder();
      }
    }
  );
});

module.exports = compile;
