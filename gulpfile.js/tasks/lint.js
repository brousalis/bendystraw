'use strict';

var util = require('../util');

var _ = require('lodash');
var path = require('path');
var eslintrc = require('../lib/eslintrc');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var sasslint = require('gulp-sass-lint');
var coffeelint = require('gulp-coffeelint');
var eslint = require('gulp-eslint');

function lintSass(fail, callback) {
  if (!config.styles.sass || !config.lint.sasslint.enabled)
    return callback();

  return gulp.src(path.join(config.paths.src, '**/*.{' + config.extensions.styles + '}'))
    .pipe(sasslint(config.lint.sasslint))
    .pipe(sasslint.format())
    .pipe(gulpif(fail, sasslint.failOnError()))
    .on('error', function() { util.log('The build failed due to a linting error') })
    .on('finish', function() {
      if (!fail) {
        return callback();
      } else {
        return process.exit(1);
      }
    });
}

function lintJS(fail, callback) {
  if (config.scripts.coffeescript || !config.lint.eslint.enabled)
    return;

  return gulp.src([
    path.join(config.paths.src, '**/*.js'),
    '!node_modules/**'
  ])
    .pipe(eslint(_.merge(eslintrc, config.lint.eslint)))
    .pipe(eslint.format())
    .pipe(gulpif(fail, eslint.failAfterError()))
    .on('error', function() { util.log('The build failed due to a linting error') })
    .on('finish', function() {
      if (!fail) {
        return callback();
      } else {
        return process.exit(1);
      }
    });
}

function lintCoffee(fail, callback) {
  if (!config.scripts.coffeescript || !config.lint.coffeelint.enabled)
    return callback();

  var reporter = fail ? 'fail' : '';

  return gulp.src([
    path.join(config.paths.src, '**/*.coffee'),
    '!node_modules/**'
  ])
    .pipe(coffeelint(config.lint.coffeelint))
    .pipe(coffeelint.reporter(reporter))
    .on('error', function() { util.log('The build failed due to a linting error') })
    .on('finish', function() {
      if (!fail) {
        return callback();
      } else {
        return process.exit(1);
      }
    });
};

gulp.task('lint:sass', function(callback) {
  lintSass(false, callback);
});

gulp.task('lint:js', function(callback) {
  lintJS(false, callback);
});

gulp.task('lint:coffee', function(callback) {
  lintCoffee(false, callback);
});

gulp.task('lint:build', function(callback) {
  lintJS(true, callback);
  lintCoffee(true, callback);
  lintSass(true, callback);
});

gulp.task('lint', ['lint:sass', 'lint:js', 'lint:coffee']);

module.exports = function(){};
