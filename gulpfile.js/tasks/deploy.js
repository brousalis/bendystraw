'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var util = require('../util');
var $ = require('gulp-load-plugins')();

gulp.task('prepare', function(callback) {
  runSequence('clean', 'make', 'deploy-s3', callback);
});

gulp.task('deploy', ['set-production', 'prepare']);
gulp.task('deploy:staging', ['set-staging', 'prepare']);
gulp.task('deploy:production', ['set-production', 'prepare']);

gulp.task('deploy-s3', function() {
  var json = require(process.env.INIT_CWD + '/env.json');
  var conf = json[process.env.NODE_ENV];

  // The first key is the module name, so skip it
  var key = Object.keys(conf)[0];
  var conf = conf[key];

  if(conf['AWS_BUCKET'] == '' || conf['AWS_BUCKET'] == undefined) {
    util.errorHandler('Deploy')(new Error('Missing AWS settings in env file.'));
    return false;
  }

  var headers = { 'Cache-Control': 'max-age=315360000, no-transform, public' };

  var gzip = gulp.src([
    path.join(config.paths.dest, '*.{html,js,css}'),
    path.join(config.paths.dest, '**/*.{html,js,css}'),
  ]).pipe($.awspublish.gzip({ext: '.gz'}));

  var plain = gulp.src([
    path.join(config.paths.dest, '*'),
    path.join(config.paths.dest, '**/*'),
  ]);

  var publisher = $.awspublish.create({
    params: { Bucket: conf['AWS_BUCKET'] },
    accessKeyId: conf['AWS_ACCESS_KEY_ID'],
    secretAccessKey: conf['AWS_SECRET_ACCESS_KEY']
  });

  merge(gzip, plain)
    .pipe(publisher.publish(headers))
    .pipe(publisher.cache())
    .pipe($.awspublish.reporter());
});
