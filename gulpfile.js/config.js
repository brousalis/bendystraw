var gutil = require('gulp-util');

// Paths for the project
exports.paths = {
  src: 'source',
  tests: 'tests',
  dist: 'build',
  tmp: '.tmp'
};

 // Common implementation for an error handler of a Gulp plugin
exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
