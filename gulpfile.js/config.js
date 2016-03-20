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
    scripts: 'javascripts', // Folder where main javascript files are located
    styles: 'stylesheets', // Stylesheets folder
    images: 'images', // Images folder
    vendor: 'vendor', // Third party scripts that aren't bower components
    fonts: 'fonts', // Fonts folder
    tests: 'tests' // Folder for end to end tests
  },

  browserSync: { // Server config
    port: 4567,  // Port to run the server on
    open: true, // Opens a browser tab with the app when the server starts
  },

  // Name for env settings object, either Angular module constant or global variable
  envConstant: 'ENV',

  angular: { // Angular specific config
    enabled: false , // Turn on Angular specific features of Bendystraw
    templateCache: true, // Turn on Angular templateCache compilation
    templateModule: 'templates', // Module name for compiled templates file
    envModule: 'env', // Module name for the compiled env settings file
  },

  scripts: { // Javascript settings
    coffeescript: false, // Enable coffeescript compilation
    sourcemaps: true, // Enable sourcemap generation
    inject: [ // In what order should COMPILED scripts be injected into the template and bundled on build
      // Paths taken relative to the src (default 'source') folder.
      // ex: 'javascripts/components/**/*.js',
      // ex: 'javascripts/models/**/*.js',
    ]
  },

  html: { // Support template preprocessing
    preprocessor: false, // Use a custom html preprocessor (the gulp variant!), require('gulp-haml')
    preprocessorOptions: {}, // Pass options into the preprocessor
    minify: true, // Enable html minification
    minifyOptions: {} // Options for html-min
  },

  styles: { // Options for the sass compiler
    sass: true,
    autoprefixer: true,
    sourcemaps: true,
    compiler: {
      indentedSyntax: true,
      imagePath: 'images',
      precision: 8
    }
  },

  images: { // Options for image optimizer
    progressive: true, // Enables progressive jpeg optimizations
    use: [ require('imagemin-pngquant')() ], // Which image optimizer to use
    bower: [ // Images to copy from bower_components into the project
      // ex: 'bower_components/package/**/*'
    ]
  },

  github: { // Options for github release
    upstream: 'origin', // The "upstream" branch to fetch changes from
    origin: 'master', // Which branch to push the created release and tags to
  },

  build: { // Options for compiling the app
    gzip: true, // Enable gzip compression
    archive: true, // Zip up the app contents into build.zip (for uploading to GitHub releases)
    archiveName: 'build.zip', // Name of the archive (only .zip supported for now)
    folder: false, // str | function. A custom folder to build into. Useful when needing to deploy into a subfolder
  },

  extensions: { // Used as a reference in a couple tasks
    scripts: ['js', 'coffee', 'js.coffee'],
    templates: ['html', 'haml', 'jade', 'pug', 'slim', 'jst', 'eco', 'jst.eco'],
    styles: ['css', 'scss', 'sass', 'style', 'css.scss', 'css.sass'],
    fonts: ['eot', 'svg', 'ttf', 'woff', 'woff2', 'otf'],
    images: ['jpg', 'jpeg', 'png', 'svg', 'gif']
  }
};

module.exports = settings;
