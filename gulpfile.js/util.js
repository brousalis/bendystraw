var path = require('path');
var fs = require('fs');

var notify = require('gulp-notify');
var gutil = require('gulp-util');

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

// Check if a file exists
exports.fileExists = function(filename) {
 return fs.existsSync(path.resolve(filename));
};

// Return the dotenv filename for the current environment
exports.envFile = function() {
  var filename = '.env';
  if (process.env.NODE_ENV !== 'development')
    filename = filename + '.' + process.env.NODE_ENV;
  return filename;
};
