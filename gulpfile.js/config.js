var gutil = require('gulp-util');
var dotenv = require('dotenv').load();
var pngquant = require('imagemin-pngquant');

exports.paths = {
  src: 'source',
  dest: 'build',
  tests: 'tests',
  scripts: 'app',
  styles: 'stylesheets',
  images: 'images',
  fonts: 'fonts',
  tmp: '.tmp'
};

exports.settings = {
  module: process.env["ANGULAR_MODULE_NAME"],
  port: '4567',
  fonts: ['eot', 'svg', 'ttf', 'woff', 'woff2'],
  images: ['jpg', 'jpeg', 'png', 'svg', 'gif'],
  imagemin: {
    progressive: true,
    verbose: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }
}

exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
