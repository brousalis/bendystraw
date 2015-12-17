'use strict';

var util = require('../util');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var bump = require('gulp-bump');
var git = require('gulp-git');
var release = require('gulp-github-release');
var fs = require('fs');
var gutil = require('gulp-util');
var request = require('request');
var path = require('path');
var runSequence = require('run-sequence');

var version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;

// Bumps the version number based on the package.json
gulp.task('bump', function(callback) {
  util.log('bumping version to ' + gutil.colors.red(version));

  return gulp.src('./package.json')
    .pipe(bump({type: "patch"}).on('error', util.errorHandler('version bump')))
    .pipe(gulp.dest('./'));
});

// Commits the changes to the version number
gulp.task('commit', function(callback) {
  util.log('committing updated manifest');

  return gulp.src('./package.json')
    .pipe(git.add())
    .pipe(git.commit('[Release] Version ' + version));
});

// Pushes changes to master
gulp.task('push', function(callback) {
  util.log('pushing changes to master');
  git.push('origin', 'master', callback);
});

// Tags new version and pushes master
gulp.task('tag', function(callback) {
  util.log('tagging version ' + gutil.colors.red(version));

  git.tag(version, '[Release] Version: ' + version, function (error) {
    if (error) {
      return callback(error);
    }
    git.push('origin', 'master', {args: '--tags'}, callback);
  });
});

// Zips up the build and creates a GitHub release
gulp.task('release', function(callback) {
  if (process.env.GITHUB_TOKEN === '' || process.env.GITHUB_TOKEN === undefined) {
    util.errorHandler('deploy')(new Error('Missing GITHUB_TOKEN environment variable'));
    return false;
  }

  util.log('zipping and releasing version ' + version + ' to github');

  return gulp.src([
    path.join(config.paths.dest, '*'),
    path.join(config.paths.dest, '**/*'),
  ])
    .pipe(zip('build.zip'))
    .pipe(release({
      token: process.env.GITHUB_TOKEN,
      manifest: require('./package.json'),
    }));
});

// Posts to a Slack webhook url
function slack(message) {
  if (process.env.SLACK_WEBHOOK_URL === undefined || process.env.SLACK_WEBHOOK_URL === '')
    return;

  util.log('posting deployment message to Slack webhook');

  request.post({
    json: true,
    url: process.env.SLACK_WEBHOOK_URL,
    body: {text: message}
  })
}

gulp.task('release', function(callback) {
 runSequence(
    'bump',
    'commit',
    'push',
    'tag',
    'release',
    function (error) {
      if (error) {
        util.errorHandler('release')(error);
        slack('deployment version ' + gutil.colors.red(version) + ' failed! ' + error.message);
      } else {
        var message = 'released version ' + gutil.colors.red(version) + ' successfully';
        util.log(message);
        slack(message);
      }
      callback(error);
    });
});

module.exports = release;
