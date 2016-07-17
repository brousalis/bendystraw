'use strict';

var fs = require('fs');

function repo() {
  var manifest = exports.file();
  var repo = manifest.repository && /git@github\.com:([\w-]+)\/([\w-]+)\.git/.exec(manifest.repository.url);
  if (!repo) repo = /git\:\/\/github\.com\/([\w-]+)\/([\w-]+)\.git/.exec(manifest.repository.url);
  return repo;
}

exports.file = function() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}

exports.version = function() {
  return 'v' + exports.file().version
}

exports.name = function() {
  return exports.file().name
}

exports.owner = function() {
  return repo()[1];
};

exports.repo = function() {
  return repo()[2];
};
