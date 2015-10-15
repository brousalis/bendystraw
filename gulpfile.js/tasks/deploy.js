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
  var conf = '';
  var json = '';
  var key = '';

  // Try to load the env.json file to pull AWS settings from there
  try {
    json = require(path.resolve(config.paths.env));
    conf = json[process.env.NODE_ENV];
  } catch (e) {}

  // Fall back to ENV variables if env.json doesn't exist
  if(conf != '') {
    // The first key is the module name, so skip it
    key = Object.keys(conf)[0];
    conf = conf[key];
  } else {
    conf = process.env
  }

  // If we're passing in --bucket=AWS_BUCKET_NAME, use that
  if(argv.bucket) {
    conf['AWS_BUCKET'] = argv.bucket
  }

  if(conf['AWS_BUCKET'] == '' || conf['AWS_BUCKET'] == undefined) {
    util.errorHandler('Deploy')(new Error('Missing AWS settings in env file.'));
    return false;
  }

  var headers = { 'Cache-Control': 'max-age=315360000, no-transform, public' };

  // Grab text files and gzip them
  var gzip = gulp.src([
    path.join(config.paths.dest, '*.{html,js,css}'),
    path.join(config.paths.dest, '**/*.{html,js,css}'),
  ]).pipe($.awspublish.gzip({ext: '.gz'}));

  // Grab all other files for upload
  var plain = gulp.src([
    path.join(config.paths.dest, '*'),
    path.join(config.paths.dest, '**/*'),
  ]);

  var publisher = $.awspublish.create({
    params: { Bucket: conf['AWS_BUCKET'] },
    accessKeyId: conf['AWS_ACCESS_KEY_ID'],
    secretAccessKey: conf['AWS_SECRET_ACCESS_KEY']
  });

  // Upload all files, including gziped, to S3 bucket
  merge(gzip, plain)
    .pipe(publisher.publish(headers))
    .pipe(publisher.cache())
    .pipe($.awspublish.reporter())
    .pipe($.cloudfront({
      bucket: conf['AWS_BUCKET'],
      key: conf['AWS_ACCSES_KEY_ID'],
      secret: conf['AWS_SECRET_ACCESS_KEY']
    }))
});
