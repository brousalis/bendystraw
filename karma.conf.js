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

    ngHtml2JsPreprocessor: {
      stripPrefix: config.paths.src + '/',
      moduleName: config.settings.module
    },

    browsers: ['PhantomJS'],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-angular-filesort',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],

    preprocessors: {}
  };

  configuration.preprocessors[config.paths.src + '/**/*.html'] = ['ng-html2js']

  // This block is needed to execute Chrome on Travis
  // If you ever plan to use Chrome and Travis, you can keep it
  // If not, you can safely remove it
  // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
  if(configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
    configuration.customLaunchers = {
      'chrome-travis-ci': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };
    configuration.browsers = ['chrome-travis-ci'];
  }

  kconfig.set(configuration);
};
