'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var $ = require('gulp-load-plugins')();

gulp.task('deploy', function() {
  // create a new publisher using S3 options
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
  var publisher = $.awspublish.create({
    params: {
      Bucket: process.env['AWS_BUCKET']
    },
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY']
  });

  // define custom headers
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };

  return gulp.src(path.join(config.paths.dest))
     // gzip, Set Content-Encoding headers and add .gz extension
    .pipe($.awspublish.gzip({ ext: '.gz' }))

    // publisher will add Content-Length, Content-Type and headers specified above
    // If not specified it will set x-amz-acl to public-read by default
    .pipe(publisher.publish(headers))

    // create a cache file to speed up consecutive uploads
    .pipe(publisher.cache())

     // print upload updates to console
    .pipe(awspublish.reporter());
});

