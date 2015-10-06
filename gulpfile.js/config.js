var gutil = require('gulp-util');

exports.paths = {
  src: 'source',
  tests: 'tests',
  dist: 'build',
  tmp: '.tmp'
};

exports.settings = {
  module: 'wccApp',
  root: 'app'
}

exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
