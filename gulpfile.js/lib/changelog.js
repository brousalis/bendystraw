'use strict';

var util = require('../util');
var gulp = require('gulp');

// Gets the previously tagged release
function getPreviousVersion(callback) {
  var spawn = require('child_process').spawn;
  var gitLog = spawn('git', ['describe', '--tags', '--abbrev=0', 'HEAD^'], {
    cwd : process.cwd(),
    stdio : ['ignore', 'pipe', process.stderr]
  });

  var out = '';

  gitLog.stdout.on('data', function(data) {
    out += data;
  });

  gitLog.on('exit', function(code) {
    if (code === 0) {
      callback(out);
    }
  });
}

// Generates a list of changes from one tag to HEAD based on commit messages
// taken mostly from https://github.com/ariatemplates/git-release-notes
function changelog(version, callback) {
  version = typeof version !== 'undefined' ?  version : util.version();

  var spawn = require('child_process').spawn;
  var range = version.replace(/^\s+|\s+$/g, '') + '..HEAD';

  var formatOptions = [
    '___', '"sha":"%H"', '"authorName":"%an"', '"authorEmail":"%ae"', '"authorDate":"%aD"',
    '"committerName":"%cn"', '"committerEmail":"%ce"', '"committerDate":"%cD"',
    '"title":"%s"'
  ].join(',');

  var gitArgs = [
    'log',
    '--no-color',
    '--no-merges',
    '--branches=master',
    '--format=' + formatOptions,
    range
  ];

  var gitLog = spawn('git', gitArgs, {
    cwd : process.cwd(),
    stdio : ['ignore', 'pipe', process.stderr]
  });

  var allCommits = '';

  gitLog.stdout.on('data', function(data) {
    allCommits += data;
  });

  gitLog.on('exit', function(code) {
    if (code === 0) {
      allCommits = allCommits.replace(/\r\n?|[\n\u2028\u2029]/g, '\n').replace(/^\uFEFF/, '');

      var stream = allCommits.split('___,');
      var commits = {
        markdown: '',
        raw: ''
      }

      stream.forEach(function(commit) {
        if (commit === '' || commit === undefined) return
        commit = JSON.parse('{' + commit + '}')

        var title = commit.title.replace(/\[|\]/g,"`");
        var sha = '<https://github.com/' + util.owner()+ '/' + util.repo() + '/commit/' + commit.sha + '|' + commit.sha.slice(0,5) + '>';

        commits.markdown += commit.authorName + ': ' + title + ' (' + sha + ')\n';
        commits.raw += commit.authorName + ': ' + commit.title + ' (' + commit.sha.slice(0,5) + ')\n';
      });

      callback && callback(commits);
    } else {
      util.errorHandler('changelog')(new Error('Could not find the previous version of the app. Please check your tags/releases'));
    }
  });
}

module.exports = function(previous, callback) {
  if (previous === true) {
    getPreviousVersion(function(version) {
      changelog(version, callback);
    })
  } else {
    changelog(util.version(), callback);
  }
};
