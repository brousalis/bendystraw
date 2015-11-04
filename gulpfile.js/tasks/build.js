'use strict';

var gulp = require('gulp');
var path = require('path');
var del = require('del');
var fs = require('fs');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var mainBowerFiles = require('main-bower-files');
var util = require('../util');
var $ = require('gulp-load-plugins')();

gulp.task('build', ['set-production', 'make']);
gulp.task('build:staging', ['set-staging', 'make']);
gulp.task('build:production', ['set-production', 'make']);

// Builds the app to be deployed to production.
gulp.task('make', function(callback) {
  runSequence('clean', ['compile', 'images', 'fonts', 'other'], callback);
})

// Compiles/minifys the assets
gulp.task('compile', ['inject'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  // This does a lot.
  // - Uses ngAnnotate to correct the syntax of the Angular dependency injection
  // - Minifies javascript files
  // - Minifies css
  // - Uses useref to concat files into bundles using build: syntax in html
  // - Cachebusting for all assets using rev
  // - Minifies html files
  // - Copies all files into the build folder
  // - Prints out sizes of compiled files
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
});

// Only applies to fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  if(!fs.existsSync(path.resolve('bower.json')) || !fs.existsSync('bower_components'))
    return

  return gulp.src(mainBowerFiles())
    .pipe($.filter('**/*.{' + config.extensions.fonts.join(',') + '}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(config.paths.dest, '/fonts/')));
});

// Used for custom fonts, files in the other folders, etc...
gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  // This isn't a very good way of doing this :(
  return gulp.src([
    path.join(config.paths.src, '/**/*'),
    path.join('!' + config.paths.src, '/**/*.{html,haml,jade,css,sass,styl,scss,js,coffee,' + config.settings.images.join(',') + '}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(config.paths.dest, '/')));
});

// Cleans the build folder and tmp folder for development
gulp.task('clean', function (callback) {
  del([path.join(config.paths.dest, '/'), path.join(config.paths.tmp, '/')], callback);
});

module.exports = function(){};
