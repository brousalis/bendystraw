'use strict';

var util = require('../util');

var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var b2v = require('buffer-to-vinyl');
var dotenv = require('dotenv');
var gulpNgConfig = require('gulp-ng-config');
var $ = require('gulp-load-plugins')();

// Creates a config.js Angular config module from env file
// TEST=test.com in .env becomes:
//   angular.module('env', [])
//   .constant('ENV', {"TEST":"test.com"})
//   .constant('NODE_ENV', "development");
// So you can access environment variables easier from your Angular app
function env() {
  var dest = path.join(config.paths.tmp, '/serve', config.paths.scripts);

  // Check if we even have a .env file to use
  if(!util.checkForEnv())
    return false

  // Gets the config settings for the current NODE_ENV, also stubs that in
  var ngConfig = {
    environment: process.env.NODE_ENV,
    constants: { NODE_ENV: process.env.NODE_ENV }
  };

  // Read the .env file
  var fileContent = fs.readFileSync(util.envFile(), "utf8");

  // Parse the .env to an object
  fileContent = dotenv.parse(fileContent);

  // Wrap the object in a main key, easier to include in angular
  var tmp = {}
  tmp[config.settings.envConstant] = fileContent;
  fileContent = tmp;

  // Stringify the .env file
  fileContent = JSON.stringify(fileContent);

  // Write the app config to an env file
  b2v.stream(new Buffer(fileContent), 'env.js')
    .pipe(gulpNgConfig(config.settings.envModule, ngConfig)
    .on('error', util.errorHandler('ng-config')))
    .pipe(gulp.dest(dest))
};

gulp.task('env', env);

module.exports = env;
