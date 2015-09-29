process.env.NODE_ENV = 'development';

// Pass in a custom environment
if (process.argv.length > 2) {
  var argv = require('minimist')(process.argv.slice(2));
  process.env.NODE_ENV = argv.env || 'development';
}

var settings = {
  paths: {
    src: 'source', // source folder for the app
    dest: 'build', // destination for the production build
    tmp: '.dev', // temporary development build folder
    scripts: 'app', // folder where main javascript files are located
    styles: 'stylesheets', // stylesheets folder
    images: 'images', // image folder
    vendor: 'vendor', // third party scripts that aren't bower components
    fonts: 'fonts', // fonts folder
    tests: 'tests' // folder for end to end tests
  },

  port: '4567',  // port to run the server on

  envModule: 'env', // angular module name for the env file
  envConstant: 'ENV', // angular constant name for env file
  templateModule: 'templates', // angular module name for template cache

  sass: { // options for the sass compiler
    indentedSyntax: true,
    imagePath: 'images',
    precision: 8
  },

  images: { // options for image optimizer
    progressive: true,
    use: [ require('imagemin-pngquant')() ]
  },

  html: { // options for html minification
    empty: true,
    spare: true,
    quotes: true,
    conditionals: true
  },

  bowerImages: [ // images to copy into project from bower_components
    // 'bower_components/rolodex/**/*'
  ],

  extensions: { // used as a reference in a couple tasks
    scripts: ['js', 'coffee'], // js preprocessor extensions
    templates: ['html', 'haml', 'jade', 'slim'], // html preprocessor extensions
    styles: ['css', 'scss', 'sass', 'style'], // css preprocessor extensions
    fonts: ['eot', 'svg', 'ttf', 'woff', 'woff2'], // font extensions
    images: ['jpg', 'jpeg', 'png', 'svg', 'gif'] // image extensions
  }
};

module.exports = settings;
