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
    '___', '%H', '%an', '%s'
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
        slack: '',
        raw: ''
      }

      stream.forEach(function(commit) {
        if (commit === '' || commit === undefined) return
        // sha,author,title
        var data = commit.split(',')

        var author = data[1];
        var title = data[2].replace(/(\r\n|\n|\r)/gm,""); // trim newlines
        var label = title.replace(/\[|\]/g,"`"); // convert [] to `` for markdown
        var sha = data[0].slice(0,5); // only need first 5 of sha
        var shaUrl = '<https://github.com/' + util.owner()+ '/' + util.repo() + '/commit/' + sha + '>';
        var slackUrl = '<https://github.com/' + util.owner()+ '/' + util.repo() + '/commit/' + sha + '|' + sha + '>';

        commits.slack += author + ': ' + label + ' (' + slackUrl + ')\n';
        commits.markdown += '* ' + author + ': ' + label + ' (' + shaUrl + ')\n';
        commits.raw += author + ': ' + title + ' (' + sha + ')\n';
      });

      callback && callback(commits);
    } else {
      util.log('If this is your first release, ignore this error. If not, the changelog can\'t find a previous tag to compare to, the changelog will default to the date.')
      callback && callback('');
    }
  });
}

module.exports = function(previous, callback) {
  if (previous) {
    getPreviousVersion(function(version) {
      changelog(version, callback);
    })
  } else {
    changelog(util.version(), callback);
  }
};
