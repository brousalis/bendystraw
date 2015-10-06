var gutil = require('gulp-util');

exports.paths = {
  src: 'source',
  tests: 'tests',
  dist: 'build',
  tmp: '.tmp'
};

exports.settings = {
  extensions: ['jpg', 'png', 'svg', 'gif'],
  module: 'testApp',
  root: 'app',
}

exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
