var gutil = require('gulp-util');
var dotenv = require('dotenv').load({path: 'config.json'});
var pngquant = require('imagemin-pngquant');

process.env.NODE_ENV = 'development';

exports.paths = {
  src: 'source', // source folder for the app
  dest: 'build', // destination for the production build
  tmp: '.dev', // temporary development build folder

  scripts: 'app', // folder where main javascript files are located
  styles: 'stylesheets', // stylesheets folder
  images: 'images', // image folder
  fonts: 'fonts', // fonts folder
  tests: 'tests' // folder for end to end tests
};

exports.settings = {
  module: 'templates', // angular module name for template cache
  port: '4567',  // port to run the server on
  imageFilter: '**', // ex: '**/icons/*' filter out any images imported from bower_components
  imagemin: { // options for image optimizer
    progressive: true,
    verbose: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  },
  minifyHtml: { // options for html minification
    empty: true,
    spare: true,
    quotes: true,
    conditionals: true
  },
  fonts: ['eot', 'svg', 'ttf', 'woff', 'woff2'], // font extensions
  images: ['jpg', 'jpeg', 'png', 'svg', 'gif'] // image extensions
};

exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());

    if (this.emit !== null && this.emit !== undefined)
      this.emit('end');
  };
};
