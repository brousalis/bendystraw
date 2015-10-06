var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
var pngquant = require('imagemin-pngquant');
var $ = require('gulp-load-plugins')();

gulp.task('images', function() {
  return gulp.src(path.join(config.paths.src, '/images/**'))
    .pipe($.changed(path.join(config.paths.tmp, '/serve/images')))
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve/images')))
    .pipe(browserSync.reload({stream:true}))
})
