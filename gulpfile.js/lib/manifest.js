'use strict';
// TODO: use https://github.com/npm/read-package-json

// Reads out the repo
function repo() {
  var manifest = exports.manifest();
  var repo = manifest.repository && /git@github\.com:([\w-]+)\/([\w-]+)\.git/.exec(manifest.repository.url);
  if (!repo) repo = /git\:\/\/github\.com\/([\w-]+)\/([\w-]+)\.git/.exec(manifest.repository.url);
  return repo;
}

// Getters for various aspects of the manifest (package.json)
exports.file = function() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}

exports.version = function() {
  return 'v' + exports.manifest().version
}

exports.owner = function() {
  return repo()[1];
};

exports.repo = function() {
  return repo()[2];
};
