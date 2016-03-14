'use strict';

var util = require('../util');

var path = require('path');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var changed = require('gulp-changed');
var browserSync = require('browser-sync').get('server');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var coffee = require('gulp-coffee');

// Compiles coffeescript files to javascript files, creates sourcemaps
function scripts() {
  var dest = path.join(config.paths.tmp, config.paths.scripts);

  return gulp.src(path.join(config.paths.src, config.paths.scripts, '**/*.{' + config.extensions.scripts + '}'))
    .pipe(changed(dest, { extension: '.js' }))
    .pipe(gulpif(config.scripts.sourcemaps, sourcemaps.init()))
    .pipe(gulpif(config.scripts.coffeescript, coffee()))
    .on('error', util.errorHandler('coffeescript'))
    .pipe(gulpif(config.angular.enabled, ngAnnotate()))
    .pipe(gulpif(config.scripts.sourcemaps, sourcemaps.write()))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
}

gulp.task('scripts', scripts);

module.exports = scripts;
