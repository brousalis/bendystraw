var path = require('path');
var fs = require('fs');

var _ = require('lodash');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var through = require('through2');

// Handles error messaging in the stream. Will post a Mac toast if errors.
exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err);

    if (err.stack !== 'undefined') {
      message = err.stack;
    } else {
      message = err.message;
    }

    notify.onError({
      title: title,
      message: gutil.colors.stripColor(message)
    }).apply(this, arguments);

    if (typeof this.emit === 'function') this.emit('end');
  };
};

// Generic log for bendystraw
exports.log = function(msg) {
  gutil.log(gutil.colors.green('[bendystraw]'), msg);
};

// Generic log for bendystraw
exports.streamLog = function(msg) {
  return through.obj(function(file, enc, cb) {
    gutil.log(gutil.colors.green('[bendystraw]'), msg);
  });
};

// Check if a file exists
exports.fileExists = function(filename) {
 return fs.existsSync(path.resolve(filename));
};

// Check if a dotenv file exists for the current environment
exports.checkForEnv = function() {
  return exports.fileExists(exports.envFile());
};

// Return the dotenv filename for the current environment
exports.envFile = function() {
  var filename = '.env';
  if (process.env.NODE_ENV !== 'development')
    filename = filename + '.' + process.env.NODE_ENV;
  return filename;
};

// Getters for various aspects of the manifest (package.json)
function manifest() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}

exports.version = function() {
  return manifest().version
}

function repo() {
  var repo = manifest().repository && /git@github\.com:([\w-]+)\/([\w-]+)\.git/.exec(manifest().repository.url);
  if (!repo) repo = /git\:\/\/github\.com\/([\w-]+)\/([\w-]+)\.git/.exec(manifest().repository.url);
  return repo;
}

exports.owner = function() {
  return repo()[1];
};

exports.repo = function() {
  return repo()[2];
};
