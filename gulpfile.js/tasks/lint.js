'use strict';

var util = require('../util');

var path = require('path');

var gulp = require('gulp');
var sassLint = require('gulp-sass-lint');
var coffeeLint = require('gulp-coffeelint');
var esLint = require('gulp-eslint');

gulp.task('lint:sass', function () {
  if (!config.styles.sass) return

  return gulp.src(path.join(config.paths.src, config.paths.styles, '**/*.{' + config.extensions.styles + '}'))
    .pipe(sassLint(config.lint.sasslint))
    .pipe(sassLint.format())
});

gulp.task('lint:js', function () {
  if (config.scripts.coffeescript) return

  return gulp.src([
    path.join(config.paths.src, config.paths.scripts, '**/*.js'),
    '!node_modules/**'
  ])
    .pipe(esLint(config.lint.eslint))
    .pipe(esLint.format())
});

gulp.task('lint:coffee', function () {
  if (!config.scripts.coffeescript) return

  return gulp.src([
    path.join(config.paths.src, config.paths.scripts, '**/*.coffee'),
    '!node_modules/**'
  ])
    .pipe(coffeeLint(config.lint.coffeelint))
    .pipe(coffeeLint.reporter())
});

gulp.task('lint', ['lint:sass', 'lint:js', 'lint:coffee']);

module.exports = function(){};
