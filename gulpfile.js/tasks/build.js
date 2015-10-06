'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');

var $ = require('gulp-load-plugins')();

gulp.task('partials', ['markups'], function () {
  return gulp.src([
    path.join(config.paths.src, '/app/**/*.html'),
    path.join(config.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'wccApp',
      root: 'app'
    }))
    .pipe(gulp.dest(config.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(config.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(config.paths.tmp, '/partials'),
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src(path.join(config.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', config.errorHandler('Uglify'))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(path.join(config.paths.dist, '/')))
    .pipe($.size({ title: path.join(config.paths.dist, '/'), showFiles: true }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(config.paths.dist, '/fonts/')));
});

gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(config.paths.src, '/**/*'),
    path.join('!' + config.paths.src, '/**/*.{html,css,js,sass,coffee,jade}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(config.paths.dist, '/')));
});

gulp.task('clean', function (done) {
  $.del([path.join(config.paths.dist, '/'), path.join(config.paths.tmp, '/')], done);
});

gulp.task('build', ['html', 'other']);
