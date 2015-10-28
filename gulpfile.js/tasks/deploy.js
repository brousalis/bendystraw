'use strict';

var gulp = require('gulp');
var argv = require('yargs').argv;
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
  // Check if we even have a .env file to use
  return util.checkForEnv(util.envFile(), 'deploy');

  var conf = process.env;

  // If we're passing in --bucket=AWS_BUCKET_NAME, use that
  // Useful for multiple environment CI deployments
  if(argv.bucket) {
    conf['AWS_BUCKET'] = argv.bucket
  }

  if(conf['AWS_BUCKET'] === '' || conf['AWS_BUCKET'] === undefined) {
    util.errorHandler('deploy')(new Error('Missing AWS settings in env file.'));
    return false;
  }

  var headers = { 'Cache-Control': 'max-age=315360000, no-transform, public' };

  var publisher = $.awspublish.create({
    params: { Bucket: conf['AWS_BUCKET'] },
    accessKeyId: conf['AWS_ACCESS_KEY_ID'],
    secretAccessKey: conf['AWS_SECRET_ACCESS_KEY']
  });

  // Upload all files, including gziped, to S3 bucket
  gulp.src([
    path.join(config.paths.dest, '*'),
    path.join(config.paths.dest, '**/*'),
  ])
    .pipe(publisher.publish(headers))
    .pipe(publisher.cache())
});
