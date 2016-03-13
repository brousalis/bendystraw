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

    // All of these paths are located INSIDE the paths.src (source/) folder
    scripts: 'app', // Folder where main javascript files are located (source/app)
    styles: 'stylesheets', // Stylesheets folder
    images: 'images', // Image folder
    vendor: 'vendor', // Third party scripts that aren't bower components
    fonts: 'fonts', // Fonts folder
    tests: 'tests' // Folder for end to end tests
  },

  // Name for env settings object,
  // either Angular module constant or global variable
  envConstant: 'ENV',

  browsersync: { // Server config
    port: '4567',  // Port to run the server on
    open: true, // Opens a browser tab with the app when the server starts
  },

  angular: { // Angular specific config
    enabled: true, // Turn on Angular specific features of Bendystraw
    templateCache: true, // Turn on Angular templateCache compilation
    templateModule: 'templates', // Module name for compiled templates file
    envModule: 'env', // Module name for the compiled env settings file
  },

  javascript: { // Javascript settings
    coffeescript: true,
    sourcemaps: true
  },

  html: { // Support template preprocessing
    preprocessor: function(){} , // Use a custom html preprocessor (the gulp variant!), require('gulp-haml')
    preprocessorOptions: { // Pass options into the preprocessor
    },
    minifyOptions: { // Options for html-min
    }
  },

  sass: { // Options for the sass compiler
    enabled: true,
    autoprefixer: true,
    sourcemaps: true,
    compiler: {
      indentedSyntax: true,
      imagePath: 'images',
      precision: 8
    }
  },

  images: { // Options for image optimizer
    progressive: true,
    use: [ require('imagemin-pngquant')() ]
  },

  bowerImages: [ // Images to copy from bower_components into the project
    // 'bower_components/package/**/*'
  ],

  extensions: { // Used as a reference in a couple tasks
    scripts: ['js', 'coffee', 'js.coffee'], // js preprocessor extensions
    templates: ['html', 'haml', 'jade', 'slim', 'jst', 'eco', 'jst.eco'], // html preprocessor extensions
    styles: ['css', 'scss', 'sass', 'style', 'css.scss', 'css.sass'], // css preprocessor extensions
    fonts: ['eot', 'svg', 'ttf', 'woff', 'woff2', 'otf'], // font extensions
    images: ['jpg', 'jpeg', 'png', 'svg', 'gif'] // image extensions
  }
};

module.exports = settings;
