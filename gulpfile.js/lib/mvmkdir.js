
'use strict';

var util = require('../util');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

// Moves files into a folder, created in the same folder
module.exports = function(folder, callback) {

  // ¯\_(ツ)_/¯
  var mkdir = spawn(
    'mkdir',
    ['-p', folder],
    {cwd: config.paths.dest }
  );

  mkdir.on('exit', function(code) {
    if (code === 0) {
      // Now move the files into the folder we just created
      var mv = exec(
        'mv * ./' + folder,
        {cwd: config.paths.dest },
        function(err, stdout, stderr) {
          callback();
        }
      );
    }
  });
};
