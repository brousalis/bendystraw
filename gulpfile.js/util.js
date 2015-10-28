var notify = require('gulp-notify');
var gutil = require('gulp-util');
var chalk = require('chalk');
var path = require('path');

exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err);

    if(err.stack !== 'undefined') {
      message = err.stack
    } else {
      message = err.message
    }

    notify.onError({
      title: title,
      message: chalk.stripColor(message)
    }).apply(this, arguments)

    if (typeof this.emit === 'function') this.emit('end')
  };
};

exports.checkForEnv = function(env, where) {
  if(path.resolve(env) !== 'undefined') {
    exports.errorHandler(where)(new Error('Missing .env file.'));
    return false;
  } else {
    dotenv.load({path: env});
    return true;
  }
}

exports.envFile = function() {
  var s = '.env';
  if(process.env.NODE_ENV !== 'development')
    s = s + '.' + process.env.NODE_ENV;
  return s;
}
