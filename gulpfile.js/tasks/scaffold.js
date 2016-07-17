'use strict';

var util = require('../util');

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

  fs.readFile(path.resolve('gulpfile.js/templates/index.html'), 'utf8', function (err, data) {
    console.log(data)
    fs.writeFile(path.join(config.paths.src, 'index.html'), data);
  });
  fs.writeFile(path.join(config.paths.src, config.paths.scripts, 'app.js'), '');
  fs.writeFile(path.join(config.paths.src, config.paths.styles, 'app.sass'), '');
}

gulp.task('scaffold', scaffold);

module.exports = scaffold;
