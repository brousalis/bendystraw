'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
  var sassOptions = {
    indentedSyntax: true, // Enable .sass syntax!
    imagePath: 'images' // Used by the image-url helper
  };

  var injectFiles = gulp.src([
    path.join(config.paths.src, '/stylesheets/**/*.sass'),
    path.join('!' + config.paths.src, '/stylesheets/main.sass')
  ], { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(config.paths.src + '/stylesheets/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };


  return gulp.src([
    path.join(config.paths.src, '/stylesheets/main.sass')
  ])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(wiredep({directory: 'bower_components'}))
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions)).on('error', config.errorHandler('Sass'))
    .pipe($.autoprefixer()).on('error', config.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve/app/')))
    .pipe(browserSync.stream());
});
