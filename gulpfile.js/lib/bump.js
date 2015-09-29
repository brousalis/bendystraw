'use strict';

var util = require('../util');

// Uses `npm version patch` to bump the version of the app.
// Modifys the manifest, but doesn't commit it.
module.exports = function(callback) {
  var spawn = require('child_process').spawn;
  var gitLog = spawn('npm', ['version', 'patch', '--no-git-tag-version'], {
    cwd : process.cwd(),
    stdio : ['ignore', 'pipe', process.stderr]
  });

  gitLog.on('exit', function(code) {
    if (code === 0) {
      callback();
    }
  });
}
