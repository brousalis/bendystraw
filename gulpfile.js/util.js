var notify = require('gulp-notify');
var gutil = require('gulp-util');
var fs = require('fs');
var dotenv = require('dotenv');
var path = require('path');

exports.errorHandler = function(title, showNotify) {
  showNotify = typeof showNotify !== 'undefined' ?  showNotify : true;

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err);

    if (err.stack !== 'undefined') {
      message = err.stack;
    } else {
      message = err.message;
    }

    if (showNotify) {
      notify.onError({
        title: title,
        message: gutil.colors.stripColor(message)
      }).apply(this, arguments);
    }

    if (typeof this.emit === 'function') this.emit('end');
  };
};

exports.log = function(msg) {
  gutil.log(gutil.colors.green('[bendystraw]'), gutil.colors.yellow(process.env.NODE_ENV), msg);
};

exports.fileExists = function(filename) {
 return fs.existsSync(path.resolve(filename));
};

exports.checkForEnv = function() {
  return exports.fileExists(exports.envFile());
};

exports.envFile = function() {
  var filename = '.env';
  if (process.env.NODE_ENV !== 'development')
    filename = filename + '.' + process.env.NODE_ENV;
  return filename;
};
