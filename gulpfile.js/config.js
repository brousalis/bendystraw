process.env.NODE_ENV = 'development';

// Pass in a custom environment --env=pizza
if (process.argv.length > 2) {
  var argv = require('minimist')(process.argv.slice(2));
  process.env.NODE_ENV = argv.env || 'development';
}

var settings = {
  paths: {
    src: 'source', // Source folder for the app
    dest: 'build', // Destination for the production build
    tmp: '.dev', // Temporary development build folder
    scripts: 'app', // Folder where main javascript files are located
    styles: 'stylesheets', // Stylesheets folder
    images: 'images', // Image folder
    vendor: 'vendor', // Third party scripts that aren't bower components
    fonts: 'fonts', // Fonts folder
    tests: 'tests' // Folder for end to end tests
  },

  port: '4567',  // Port to run the server on

  // Angular specific config
  angular: true, // Turn on angular annotation and file sorting
  envModule: 'env', // Angular module name for the env file
  envConstant: 'ENV', // Constant name for env file, either Angular module or global on window
  templateModule: 'templates', // Angular module name for template cache

  // Support JST template compilation :(
  jst: false,

  sass: { // Options for the sass compiler
    indentedSyntax: true,
    imagePath: 'images',
    precision: 8
  },

  images: { // Options for image optimizer
    progressive: true,
    use: [ require('imagemin-pngquant')() ]
  },

  html: { // Options for html minification
  },

  bowerImages: [ // Images to copy into project from bower_components
    // 'bower_components/rolodex/**/*'
  ],

  extensions: { // Used as a reference in a couple tasks
    scripts: ['js', 'coffee'], // js preprocessor extensions
    templates: ['html', 'haml', 'jade', 'slim', 'jst'], // html preprocessor extensions
    styles: ['css', 'scss', 'sass', 'style'], // css preprocessor extensions
    fonts: ['eot', 'svg', 'ttf', 'woff', 'woff2'], // font extensions
    images: ['jpg', 'jpeg', 'png', 'svg', 'gif'] // image extensions
  }
};

module.exports = settings;
