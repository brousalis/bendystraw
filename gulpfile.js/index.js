var gulp = require('gulp');
var requireDir = require('require-dir');

// Require all tasks in gulpfile.js/tasks
requireDir('./tasks', { recurse: true })

// Default task runs the dev server
gulp.task('default', ['server']);
