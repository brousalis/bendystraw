'use strict';

var util = require('../util');
var changelog = require('../lib/changelog');
var manifest = require('../lib/manifest');
var slack = require('../lib/slack');

var path = require('path');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var RevAll = require('gulp-rev-all');
var runSequence = require('run-sequence');
var awspublish = require('gulp-awspublish');
var cloudfront = require('gulp-cloudfront');
var notifier = require('node-notifier');

var silent = false;

// If --silent is passed in, it will ignore Slack post
if (process.argv.length > 2) {
  var argv = require('minimist')(process.argv.slice(2));
  silent = argv.silent;
}

// Deploy the build folder to an S3 bucket
function deploy(callback) {
  var conf = process.env;
  var env = process.env.NODE_ENV;

  var options = {
    aws_bucket: conf.AWS_BUCKET,
    aws_access_key_id: conf.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: conf.AWS_SECRET_ACCESS_KEY,
    aws_distribution_id: conf.AWS_DISTRIBUTION_ID,
    aws_cloudfront_domain: conf.AWS_CLOUDFRONT_DOMAIN
  };

  // Prefix env variables based on app environment (unless in --env development)
  // --env production, AWS_BUCKET becomes PRODUCTION_AWS_BUCKET
  if (env !== 'development') {
    for (var key in options) {
      options[key] = conf[env.toUpperCase() + '_' + key.toUpperCase()];
    }
  }

  if (options.aws_bucket === '' ||
      options.aws_bucket === undefined) {
    util.errorHandler('deploy')(new Error('Missing AWS settings in env.'));
    return false
  }

  var headers = { 'Cache-Control': 'max-age=315360000, no-transform, public' };

  var publisher = awspublish.create({
    params: { Bucket: options.aws_bucket },
    accessKeyId: options.aws_access_key_id,
    secretAccessKey: options.aws_secret_access_key
  });

  var cdn = {
    params: { Bucket: options.aws_bucket },
    accessKeyId: options.aws_access_key_id,
    secretAccessKey: options.aws_secret_access_key,
    distributionId: options.aws_distribution_id
  };

  var revOptions = {
    dontSearchFile: [/^\/vendor.js$/g, /vendor.js$/g, 'vendor.js'],
    dontRenameFile: [/^\/favicon.ico$/g, /^\/index.html/g]
  };

  if (options.aws_cloudfront_domain !== '' &&
      options.aws_cloudfront_domain !== undefined) {
    revOptions.prefix = 'https://' + options.aws_cloudfront_domain;
  }

  // Upload all files, revisioned, gzipped, to S3 bucket
  var revAll = new RevAll(revOptions);

  return gulp.src([
    path.join(config.paths.build, '*'),
    path.join(config.paths.build, '**/*'),
  ])
    .pipe(revAll.revision())
    .pipe(publisher.publish())
    .pipe(gulpif(config.deploy.sync, publisher.sync()))
    .pipe(gulpif(config.deploy.cache, publisher.cache()))
    .pipe(awspublish.reporter())
    .pipe(gulpif(options.aws_distribution_id !== undefined, cloudfront(cdn)))
    .on('finish', function() {
      if (process.env.GITHUB_TOKEN === '' || process.env.GITHUB_TOKEN === undefined) {
        completeDeploy();
      } else {
        changelog(true, function(commits) {
          completeDeploy(commits);
        });
      }
      callback();
    });
}

function completeDeploy(commits) {
  var conf = process.env;

  var options = {
    aws_bucket: conf.AWS_BUCKET
  };

  var message = 'Deployed ' + manifest.version() + ' to ' + options.aws_bucket;

  util.log('🍺  ' + gutil.colors.yellow(message));

  if (config.deploy.slack || !silent) {
    slack(
      message + ' to S3 bucket <https://console.aws.amazon.com/s3/home?&bucket=' + options.aws_bucket + '|' + options.aws_bucket + '>',
      {
        attachments: [
          {
            color: '#63bbe9',
            mrkdwn_in: ['text', 'pretext'],
            text: (commits ? commits.slack : '')
          }
        ]
      }
    );
  }

  notifier.notify({
    title: 'bendystraw',
    message: '🍺  Deployed to ' + options.aws_bucket,
    icon: path.join(__dirname, '../lib/logo.png'),
    sound: true
  })
};

gulp.task('deploy', function(callback) {
  if (!util.fileExists(config.paths.build)) {
    util.errorHandler('deploy')(new Error('You need to build the application first. Run `gulp build`'));
    return;
  }

  deploy(callback);
});

module.exports = deploy;
