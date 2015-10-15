var gulp = require('gulp');
var requireDir = require('require-dir');

// Require all tasks in gulpfile.js/tasks
requireDir('./tasks', { recurse: true })
