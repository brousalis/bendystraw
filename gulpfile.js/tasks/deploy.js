'use strict';

var util = require('../util');

var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var runSequence = require('run-sequence');
var RevAll = require('gulp-rev-all');
var $ = require('gulp-load-plugins')();

// Deploy the build folder to an S3 bucket
function deploy() {
  var conf = process.env;

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
};

gulp.task('deploy', ['build'], deploy);

module.exports = deploy;
