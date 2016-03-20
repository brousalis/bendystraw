'use strict';

var util = require('../util');

var path = require('path');
var fs = require('fs');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var b2v = require('buffer-to-vinyl');
var dotenv = require('dotenv');
var gulpNgConfig = require('gulp-ng-config');

// Creates a config.js Angular config module from env file
// TEST=test.com in .env becomes:
//   angular.module('env', [])
//   .constant('ENV', {"TEST":"test.com"})
//   .constant('NODE_ENV', "development");
// So you can access environment variables easier from your Angular app
function env() {
  var dest = path.join(config.paths.dev, config.paths.scripts);

  // Check if we even have a .env file to use
  if (!util.fileExists(util.envFile()))
    return false;

  // Gets the config settings for the current NODE_ENV, also stubs that in
  var ngConfig = {
    environment: process.env.NODE_ENV,
    constants: { NODE_ENV: process.env.NODE_ENV }
  };

  // Read the .env file
  var fileContent = fs.readFileSync(util.envFile(), "utf8");

  // Parse the .env to an object
  fileContent = dotenv.parse(fileContent);

  if (config.angular.enabled) {
    // Wrap the env object in a main key, easier to include in Angular
    var tmp = {};
    tmp[config.envConstant] = fileContent;
    fileContent = tmp;
  } else {
    // If angular is disabled, stub in NODE_ENV
    fileContent['NODE_ENV'] = process.env.NODE_ENV;
  }

  // Stringify the .env file
  fileContent = JSON.stringify(fileContent);

  // If not using angular, use a global variable for the env path
  // ex: Settings = {"API": "http://localhost"}
  if (!config.angular.enabled) {
    fileContent = config.envConstant + " = " + fileContent;
  }

  // Write the app config to an env file
  return b2v.stream(new Buffer(fileContent), 'env.js')
    .pipe(gulpif(config.angular.enabled, gulpNgConfig(config.angular.envModule, ngConfig))
    .on('error', util.errorHandler('env')))
    .pipe(gulp.dest(dest));
}

gulp.task('env', env);

module.exports = env;
