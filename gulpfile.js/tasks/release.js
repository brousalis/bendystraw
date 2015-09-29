'use strict';

var util = require('../util');
var changelog = require('../lib/changelog');
var bump = require('../lib/bump');

var manifest = require('../../package.json');
var gulp = require('gulp');
var gutil = require('gulp-util');
var githubRelease = require('gulp-github-release');
var runSequence = require('run-sequence');
var git = require('gulp-git');
var path = require('path');
var zip = require('gulp-zip');

// Refactor this.. global for changelog task, used later
// when tagging/releasing.
var allCommits = '';

// Prints out and stores the commits since the previous release
gulp.task('changelog', function(callback) {
  changelog(false, function(commits) {
    if (commits.raw.length > 0)
      util.log(gutil.colors.yellow('Commits since last release:'));

    commits.raw.split('\n').forEach(function(commit) {
      if(commit === '') return;
      util.log('  ' + commit);
    });

    allCommits = commits;

    callback();
  });
});

// Bumps the version number
gulp.task('bump', function(callback) {
  bump(callback);
});

// Commits the manifest with the bumped version number
gulp.task('commit', function(callback) {
  util.log(gutil.colors.yellow('Committing version bump to ' + util.version()));

  callback()
});

// Pushes the commit for the version bump
gulp.task('push', function (callback) {
  util.log(gutil.colors.yellow('Pushing version bump to ' + util.version()));

  git.push('origin', 'master', {quiet: true}, callback);
});

// Tags the new version
gulp.task('tag', function(callback) {
  util.log(gutil.colors.yellow('Tagging version ' + util.version()));

  var date = new Date().toJSON().slice(0,10);
  var message = date + ' Release\n' + allCommits.raw;

  git.tag(util.version(), message, {quiet: true}, function(err) {
    git.push('origin', 'master', {args: '--tags', quiet: true}, callback);
  });
});

// Takes the zip'd up build folder and posts it to a GitHub release
// with a changelog generated in the earlier task.
gulp.task('github-release', function(callback) {
  util.log(gutil.colors.yellow('Releasing version ' + util.version() + ' to GitHub'));

  return gulp.src(path.join(config.paths.dest, 'build.zip'))
    .pipe(githubRelease({
      token: process.env.GITHUB_TOKEN,
      notes: allCommits.markdown,
      tag: util.version(),
      manifest: manifest,
    }, function(err, release) {
      util.errorHandler('github-release')(err);
    }));
});

function release(callback) {
  if (process.env.GITHUB_TOKEN === '' ||
      process.env.GITHUB_TOKEN === undefined) {
    util.errorHandler('deploy')(new Error('Missing GITHUB_TOKEN environment variable'));
    return false;
  }

  runSequence(
    'changelog',
    'bump',
    'commit',
    'push',
    'tag',
    'github-release',
    function (error) {
      if (error) {
        util.errorHandler('release')(error);
      } else {
        util.log('🍺  ' + gutil.colors.yellow('Release complete!'));
      }
      callback(error);
    });
}

gulp.task('release', release);

module.exports = release;
