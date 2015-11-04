'use strict';

var gulp = require('gulp');
var argv = require('yargs').argv;
var path = require('path');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var RevAll = require('gulp-rev-all');
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
  var conf = process.env;

  // If we're passing in --bucket=AWS_BUCKET_NAME, use that
  // Useful for multiple environment CI deployments
  if(argv.bucket)
    conf['AWS_BUCKET'] = argv.bucket

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

  var cdn = {
    params: { Bucket: conf['AWS_BUCKET'] },
    accessKeyId: conf['AWS_ACCESS_KEY_ID'],
    secretAccessKey: conf['AWS_SECRET_ACCESS_KEY'],
    distributionId: conf['AWS_DISTRIBUTION_ID']
  };

  var revOptions = {
    dontSearchFile: [/^\/vendor.js$/g, /vendor.js$/g, 'vendor.js'],
    dontRenameFile: [/^\/favicon.ico$/g, /^\/index.html/g]
  }

  if(conf['AWS_CLOUDFRONT_DOMAIN'] !== '' && conf['AWS_CLOUDFRONT_DOMAIN'] !== undefined)
    revOptions.prefix = 'https://' + conf['AWS_CLOUDFRONT_DOMAIN'] + '.cloudfront.net/';

  // Upload all files, revisioned, gzipped, to S3 bucket
  var revAll = new RevAll(revOptions);

  util.log('deploying to S3 bucket ' + gutil.colors.red(conf['AWS_BUCKET']));

  gulp.src([
    path.join(config.paths.dest, '*'),
    path.join(config.paths.dest, '**/*'),
  ])
    .pipe(revAll.revision())
    .pipe(publisher.publish())
    .pipe(publisher.cache())
    // .pipe(publisher.sync())
    .pipe($.awspublish.reporter())
    .pipe($.cloudfront(cdn));
});

module.exports = function(){};
