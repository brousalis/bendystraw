var notify = require('gulp-notify');
var chalk = require('chalk');

exports.errorHandler = function(title) {
  return function(err) {
    // gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    // console.log(err.toString())
    notify.onError({
      title: title,
      message: chalk.stripColor(err.message)
    }).apply(this, arguments)

    if (typeof this.emit === 'function') this.emit('end')
  };
};

exports.envFile = function() {
  var s = '.env';
  if(process.env.NODE_ENV != 'development')
    s = s + '.' + process.env.NODE_ENV;
  return s;
}
