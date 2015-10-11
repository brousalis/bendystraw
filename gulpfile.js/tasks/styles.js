'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
  var sassOptions = {
    indentedSyntax: true,
    imagePath: 'images'
  };

  var injectFiles = gulp.src([
    path.join(config.paths.src, config.paths.styles, '/**/*.sass'),
    path.join('!' + config.paths.src, config.paths.styles, '/main.sass')
  ], { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(config.paths.src + config.paths.styles, '');
      return '@import ' + filePath;
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  return gulp.src([path.join(config.paths.src, config.paths.styles, '/main.sass')])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(wiredep({directory: 'bower_components'}))
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions)).on('error', config.errorHandler('Sass'))
    .pipe($.autoprefixer()).on('error', config.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve', config.paths.scripts)))
    .pipe(browserSync.stream());
});
