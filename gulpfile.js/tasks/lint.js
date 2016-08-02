'use strict';

var util = require('../util');

var _ = require('lodash');
var path = require('path');
var eslintrc = require('../lib/eslintrc');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var sasslint = require('gulp-sass-lint');
var eslint = require('gulp-eslint');
var notifier = require('node-notifier');

function lintSass(callback) {
  if (!config.styles.sass || !config.lint.sasslint.enabled)
    return callback();

  return gulp.src(path.join(config.paths.src, '**/*.{' + config.extensions.styles + '}'))
    .pipe(sasslint(config.lint.sasslint))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError(function(err) {
      var message = 'sass-lint: ' + err;
      util.log(message);
      notifier.notify({
        title: 'bendystraw',
        message: message,
        icon: path.join(__dirname, '../lib/logo-warning.png'),
        sound: true
      });
    }));
}

function lintJS(callback) {
  if (config.scripts.coffeescript || !config.lint.eslint.enabled)
    return;

  return gulp.src([
    path.join(config.paths.src, '**/*.js'),
    '!node_modules/**'
  ])
    .pipe(eslint(_.merge(eslintrc, config.lint.eslint)))
    .pipe(eslint.format())
    .pipe(eslint.results(function(results) {
      if (results.errorCount > 0 || results.warningCount > 0) {
        var count = results.errorCount + results.warningCount;
        var message = 'eslint: ' + count  + ' ' + (count > 1 ? 'issues' : 'issue') + ' found with the build.';
        util.log(message);
        notifier.notify({
          title: 'bendystraw',
          message: message,
          icon: path.join(__dirname, '../lib/logo-warning.png'),
          sound: true
        });
      }
    }))
}

gulp.task('lint:sass', function(callback) { lintSass(); callback(); });
gulp.task('lint:js', function(callback) { lintJS(); callback(); });

gulp.task('lint', ['lint:sass', 'lint:js']);

module.exports = function(){};
