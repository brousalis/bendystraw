var _ = require('lodash');
var path = require('path');
var defaults = require('./config');
var util = require('./util');
var fs = require('fs');

// Merge options with defaults
module.exports = function(options) {
  if (options === undefined) options = {};

  config = _.merge(defaults, options);

  // Grab all the tasks
  var tasks = fs
    .readdirSync(path.join(__dirname, 'tasks'))
    .map(function(file) {
      return file.replace('.js', '');
    });

  // Load all the tasks and pass in config
  tasks.forEach(function(name) {
    require('./tasks/' + name).bind(this, config);
  });
};
