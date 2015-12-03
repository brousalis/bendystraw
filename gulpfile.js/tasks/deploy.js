'use strict';

var util = require('../util');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var path = require('path');
var RevAll = require('gulp-rev-all');
var $ = require('gulp-load-plugins')();

// Deploy the build folder to an S3 bucket
function deploy() {
  var conf = process.env;
  var env = process.env.NODE_ENV;

  var options = {
    aws_bucket: conf.AWS_BUCKET,
    aws_access_key_id: conf.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: conf.AWS_SECRET_ACCESS_KEY,
    aws_distribution_id: conf.AWS_DISTRIBUTION_ID,
    aws_cloudfront_domain: conf.AWS_CLOUDFRONT_DOMAIN
  };

  // update expected env variables based on app environment (default to --development)
  if (env !== 'development') {
    for (var key in options) {
      options[key] = conf[env.toUpperCase() + '_' + key.toUpperCase()];
    }
  }

  if (options.aws_bucket === '' || options.aws_bucket === undefined) {
    util.errorHandler('deploy')(new Error('Missing AWS settings in env file.'));
    return false;
  }

  var headers = { 'Cache-Control': 'max-age=315360000, no-transform, public' };

  var publisher = $.awspublish.create({
    params: { Bucket: options.aws_bucket },
    accessKeyId: options.aws_access_key,
    secretAccessKey: options.aws_secret_access_key
  });

  var cdn = {
    params: { Bucket: options.aws_bucket },
    accessKeyId: options.aws_access_key,
    secretAccessKey: options.aws_secret_access_key,
    distributionId: options.aws_distribution_id
  };

  var revOptions = {
    dontSearchFile: [/^\/vendor.js$/g, /vendor.js$/g, 'vendor.js'],
    dontRenameFile: [/^\/favicon.ico$/g, /^\/index.html/g]
  };

  if (options.aws_cloudfront_domain !== '' && options.aws_cloudfront_domain !== undefined)
    revOptions.prefix = 'https://' + options.aws_cloudfront_domain;

  // Upload all files, revisioned, gzipped, to S3 bucket
  var revAll = new RevAll(revOptions);

  util.log('deploying to S3 bucket ' + gutil.colors.red(options.aws_bucket));

  gulp.src([
    path.join(config.paths.dest, '*'),
    path.join(config.paths.dest, '**/*'),
  ])
    .pipe(revAll.revision())
    .pipe(publisher.publish())
    .pipe(publisher.cache())
    // .pipe(publisher.sync())
    .pipe($.awspublish.reporter())
    .pipe(gulpif(options.aws_distribution_id !== undefined, $.cloudfront(cdn)));
}

gulp.task('deploy', ['build'], deploy);

module.exports = deploy;
