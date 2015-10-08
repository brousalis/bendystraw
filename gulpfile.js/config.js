var gutil = require('gulp-util');
var dotenv = require('dotenv').load();
var pngquant = require('imagemin-pngquant');

exports.paths = {
  src: 'source', // source folder for the app
  dest: 'build', // destination for the production build
  tests: 'tests', // folder for end to end tests
  scripts: 'app', // folder where main javascript files are located
  styles: 'stylesheets', // stylesheets folder
  images: 'images', // image folder
  fonts: 'fonts', // fonts folder
  tmp: '.dev' // temporary development build folder
};

exports.settings = {
  module: process.env["ANGULAR_MODULE_NAME"] || 'testApp', // angular module name for template cache
  port: '4567',  // port to run the server on
  imageFilter: '**', // ex: '**/icons/*' filter out any images imported from bower_components
  imagemin: { // configuration for image optimizer
    progressive: true,
    verbose: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  },
  fonts: ['eot', 'svg', 'ttf', 'woff', 'woff2'], // font extensions
  images: ['jpg', 'jpeg', 'png', 'svg', 'gif'] // image extensions
}

exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());

    if (this.emit !== null && this.emit !== undefined)
      this.emit('end');
  };
};
