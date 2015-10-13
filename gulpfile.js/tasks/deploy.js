'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var runSequence = require('run-sequence');
var util = require('../util');
var $ = require('gulp-load-plugins')();

gulp.task('deploy', function(callback) {
  runSequence('clean', 'build', 'deploy-s3', callback);
});

gulp.task('deploy:staging', ['set-staging', 'deploy']);
gulp.task('deploy:production', ['set-production', 'deploy']);

gulp.task('deploy-s3', function() {
  var json = require(process.env.INIT_CWD + '/env.json')
  var env = process.env['NODE_ENV']

  conf = json[env]

  if(conf['AWS_BUCKET'] == '' || conf['AWS_BUCKET'] == undefined) {
    util.errorHandler('Deploy')(new Error('Missing AWS settings in env file.'));
    return false;
  }

  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };

  var gzip = gulp.src([
    path.join(config.paths.dest, '*'),
    path.join(config.paths.dest, '**/*'),
  ]).pipe($.awspublish.gzip());

  var plain = gulp.src([
    path.join(config.paths.dest, '*'),
    path.join(config.paths.dest, '**/*'),
  ]);

  var publisher = $.awspublish.create({
    params: { Bucket: conf['AWS_BUCKET'] },
    accessKeyId: conf['AWS_ACCESS_KEY_ID'],
    secretAccessKey: conf['AWS_SECRET_ACCESS_KEY']
  });

  $.merge(gzip, plain)
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    .pipe(publisher.cache())
    .pipe($.awspublish.reporter());
});
