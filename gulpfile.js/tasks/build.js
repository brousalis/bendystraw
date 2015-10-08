'use strict';

var path = require('path');
var gulp = require('gulp');
var del = require('del');
var mainBowerFiles = require('main-bower-files');
var config = require('../config');
var $ = require('gulp-load-plugins')();

// Builds the app to be deployed to production.
gulp.task('build', ['compile', 'build-images', 'fonts', 'other']);

// Compiles/minifys the assets
gulp.task('compile', ['inject'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  // Angular templateCache injection into index.html
  var templatesInjectFile = gulp.src(path.join(config.paths.tmp, '/templates/templateCacheHtml.js'), { read: false });
  var templatesInjectOptions = {
    starttag: '<!-- inject:templates -->',
    ignorePath: path.join(config.paths.tmp, '/templates'),
    addRootSlash: false
  };

  // This does a lot.
  // - Injects the templates into Angulars templateCache, will be bundled with app.js later
  // - Uses ngAnnotate to correct the syntax of the Angular dependency injection
  // - Minifies javascript files
  // - Minifies css
  // - Uses useref to concat files into bundles using build: syntax in html
  // - Cachebusting for all assets using rev
  // - Minifies html files
  // - Copies all files into the build folder
  // - Prints out sizes of compiled files
  return gulp.src(path.join(config.paths.tmp, '/serve/*.html'))
    .pipe($.inject(templatesInjectFile, templatesInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', config.errorHandler('Uglify'))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss())
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
    .pipe(gulp.dest(path.join(config.paths.dest, '/')))
    .pipe($.size({ title: path.join(config.paths.dest, '/'), showFiles: true }));
});

// Only applies to fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  return gulp.src(mainBowerFiles())
    .pipe($.filter('**/*.{' + config.settings.fonts.join(',') + '}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(config.paths.dest, '/fonts/')));
});

// Used for custom fonts, files in the other folders, etc...
gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });
  return gulp.src([
    path.join(config.paths.src, '/**/*'),
    path.join('!' + config.paths.src, '/**/*.{html,css,js,sass,coffee,' + config.settings.images.join(',') + '}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(config.paths.dest, '/')));
});

// Cleans the build folder and tmp folder for development
gulp.task('clean', function (done) {
  del([path.join(config.paths.dest, '/'), path.join(config.paths.tmp, '/')], done);
});
