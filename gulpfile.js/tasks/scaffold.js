'use strict';

var util = require('../util');
var template = require('../lib/index')

var gulp = require('gulp');
var path = require('path');
var fs = require('fs');

function scaffold() {
  function mkdir(path) {
    try {
      fs.mkdirSync(path);
    } catch(e) {
      if (e.code != 'EEXIST') throw e;
    }
  };

  mkdir(path.join(config.paths.src));
  mkdir(path.join(config.paths.tests));
  mkdir(path.join(config.paths.src, config.paths.scripts));
  mkdir(path.join(config.paths.src, config.paths.styles));
  mkdir(path.join(config.paths.src, config.paths.images));

  fs.writeFile(path.join(config.paths.src, 'index.html'), template(config.paths));
  fs.writeFile(path.join(config.paths.src, config.paths.scripts, 'app.js'), '');
  fs.writeFile(path.join(config.paths.src, config.paths.styles, 'app.sass'), '');
}

gulp.task('scaffold', scaffold);

module.exports = scaffold;
