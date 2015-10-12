'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var util = require('../util');
var $ = require('gulp-load-plugins')();

gulp.task('deploy', function() {
  if(process.env["AWS_BUCKET"] == "" || process.env["AWS_BUCKET"] == undefined) {
    util.errorHandler('Deploy')(new Error('Missing AWS settings in env file.'));
    return false;
  }

  // Create a new publisher using S3 options
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
  var publisher = $.awspublish.create({
    params: {
      Bucket: process.env['AWS_BUCKET']
    },
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY']
  });

  // Define custom headers
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };

  return gulp.src(path.join(config.paths.dest))
     // gzip, Set Content-Encoding headers and add .gz extension
    .pipe($.awspublish.gzip({ext: '.gz'}))

    // Publisher will add Content-Length, Content-Type and headers specified above
    // If not specified it will set x-amz-acl to public-read by default
    .pipe(publisher.publish(headers))

    // Create a cache file to speed up consecutive uploads
    .pipe(publisher.cache())

    // Print upload updates to console
    .pipe($.awspublish.reporter());
});
