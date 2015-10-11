'use strict';

var path = require('path');
var config = require('./gulpfile.js/config');
var wiredep = require('wiredep');

function listFiles() {
  var wiredepOptions = {
    directory: 'bower_components',
    dependencies: true,
    devDependencies: true
  };

  return wiredep(wiredepOptions).js
    .concat([
      path.join(config.paths.tmp, '/serve', config.paths.scripts, '/**/*.js'),
      path.join(config.paths.src, '/**/*.spec.js'),
      path.join(config.paths.src, '/**/*.mock.js'),
      path.join(config.paths.src, '/**/*.html')
    ]);
}

module.exports = function(kconfig) {

  var configuration = {
    files: listFiles(),

    singleRun: true,

    autoWatch: false,

    frameworks: ['jasmine', 'angular-filesort'],

    angularFilesort: {
      whitelist: [path.join(config.paths.tmp, '/**/!(*.html|*.spec|*.mock).js')]
    },

    browsers: ['PhantomJS'],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-angular-filesort',
      'karma-jasmine',
    ]
  };

  kconfig.set(configuration);
};
