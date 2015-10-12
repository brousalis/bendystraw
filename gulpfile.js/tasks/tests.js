'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var karma = require('karma');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

function runTests (singleRun, done) {
  karma.server.start({
    configFile: path.join(__dirname, '../../../../karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun
  }, function() {
    done();
  });
}

// function runProtractor (done) {
//   var params = process.argv;
//   var args = params.length > 3 ? [params[3], params[4]] : [];

//   gulp.src(path.join(config.paths.tests, '/**/*.js'))
//     .pipe($.protractor.protractor({
//       configFile: 'protractor.conf.js',
//       args: args
//     }))
//     .on('error', function (err) {
//       // Make sure failed tests cause gulp to exit non-zero
//       throw err;
//     })
//     .on('end', function () {
//       // Close browser sync server
//       browserSync.exit();
//       done();
//     });
// }

// Downloads the selenium webdriver
// gulp.task('webdriver-update', $.protractor.webdriver_update);
// gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

// End to end testing
// gulp.task('protractor', ['protractor:source']);
// gulp.task('protractor:source', ['serve:e2e', 'webdriver-update'], runProtractor);
// gulp.task('protractor:build', ['serve:e2e-build', 'webdriver-update'], runProtractor);

// Karma testing
gulp.task('test', ['scripts'], function(done) {
  runTests(true, done);
});

gulp.task('test:watch', ['watch'], function(done) {
  runTests(false, done);
});
