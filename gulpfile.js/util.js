var gutil = require('gulp-util');

exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());

    if (this.emit !== null && this.emit !== undefined)
      this.emit('end');
  };
};
