var _ = require('lodash');
var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var defaults = require('./config');
var util = require('./util');

// Merge options with defaults
init = function(options) {
  if (options === undefined) options = {};

  var folder = 'tasks';

  // Grab all the tasks
  var tasks = fs
    .readdirSync(path.join(__dirname, folder))
    .map(function(file) {
      return file.replace('.js', '');
    });

  config = _.merge(defaults, options)

  // Load all the tasks and pass in config
  tasks.forEach(function(name) {
    require('./' + folder + '/' + name).bind(this, config);
  });

  return gulp;
};

init();

module.exports = init;
