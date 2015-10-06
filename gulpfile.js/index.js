var requireDir = require('require-dir')
var gulp = require('gulp');

// Require all tasks in gulpfile.js/tasks, including subfolders
requireDir('./tasks', { recurse: true })

// Default task
gulp.task('default', ['server']);
