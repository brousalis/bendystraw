'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');

var $ = require('gulp-load-plugins')();

// Takes the compiled html files, minifys them, then adds them to the
// Angular template cache file.
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

  // This does a lot.
  // - Injects the partials file including all of the html templates into the page
  // - Uses ngAnnotate to correct the syntax of the Angular javascript
  // - Minifies javascript files
  // - Minifies CSS
  // - Uses useref to concat files into bundles using build: syntax in html
  // - Cachebusting for all assets using rev
  // - Minifies html files
  // - Copies all files into the build folder
  // - Prints out sizes of compiled files
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

// Used for custom fonts, files in the public folder, etc...
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

// Cleans the build folder and tmp folder for development
gulp.task('clean', function (done) {
  $.del([path.join(config.paths.dist, '/'), path.join(config.paths.tmp, '/')], done);
});

gulp.task('build', ['html', 'fonts', 'other']);
