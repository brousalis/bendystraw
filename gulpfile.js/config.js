process.env.NODE_ENV = 'development';

// Pass in a custom environment, --env pizza
if (process.argv.length > 2) {
  var argv = require('minimist')(process.argv.slice(2));
  process.env.NODE_ENV = argv.env || 'development';
}

var settings = {
  paths: {
    src: 'source', // Source folder for the app
    dev: '.dev', // Temporary development build folder
    build: 'build', // Destination for the production build
    tests: 'test', // Folder for end to end tests

    // All of these paths are located inside the paths.src (source/) folder
    scripts: 'app', // Folder where main javascript files are located
    styles: 'stylesheets', // Stylesheets folder
    images: 'images', // Images folder
    vendor: 'vendor', // Third party scripts that aren't bower components
    fonts: 'fonts', // Fonts folder

    // All of these paths are located inside the paths.tess (test/) folder
    e2e: 'e2e', // Protractor tests folder
    unit: 'unit', // Unit tests folder
  },

  browserSync: { // Server config
    port: 4567,  // Port to run the server on
    open: false, // Opens a browser tab with the app when the server starts
    notify: false, // Show/hides the small notification popup when changes are made
    ghostMode: false, // Enables ghost mode (mirroring actions to all connected browsers)
  },

  // Name for env settings object, either Angular module constant or global variable
  envConstant: 'ENV',

  angular: { // Angular specific config
    enabled: false , // Turn on Angular specific features of Bendystraw
    templateCache: true, // Turn on Angular templateCache compilation
    templateModule: 'bendy.templates', // Module name for compiled templates file
    envModule: 'bendy.env', // Module name for the compiled env settings file
  },

  scripts: { // Javascript settings
    babel: false, // Enable babel es2015
    coffeescript: false, // Enable coffeescript compilation
    sourcemaps: false, // Enable sourcemap generation
    inject: [ // In what order should COMPILED scripts be injected into the template and bundled on build
      // Paths taken relative to the src (default 'source') folder.
      // ex: 'javascripts/components/**/*.js',
      // ex: 'javascripts/models/**/*.js',
    ]
  },

  html: { // Support template preprocessing
    preprocessor: false, // Use a custom html preprocessor (the gulp variant!), ex: require('gulp-haml')
    preprocessorOptions: {}, // Pass options into the preprocessor
    minify: true, // Enable html minification
    minifyOptions: {} // Options for html-min
  },

  styles: { // Options for the sass compiler
    sass: true,
    sassOptions: {
      indentedSyntax: true,
      imagePath: 'images',
      precision: 8
    },
    autoprefixer: true, // Autoprefixer
    sourcemaps: false, // Sass sourcemaps
    combineMediaQueries: true, // Combine media queries
    uncss: false, // Remove unused CSS styles from your production compiled stylesheet
    uncssOptions: {
      ignore: [/disabled+/, /open+/, /active+/]
    }
  },

  images: { // Options for image optimizer
    progressive: true, // Enables progressive jpeg optimizations
    use: [ require('imagemin-pngquant')() ], // Which image optimizer to use
    bower: [ // Images to copy from bower_components into the project
      // ex: 'bower_components/package/**/*'
    ]
  },

  release: { // Options for github release
    upstream: 'origin', // The "upstream" branch to fetch changes from
    branch: 'master', // Which branch to push the created release and tags to
  },

  lint: { // Options for linting
    sasslint: {
      enabled: true, // Will disable itself if sass isn't enable
      rules: { // Override defaults from sass-lint.yml
        'mixins-before-declarations': 0,
        'no-vendor-prefixes': 0,
        'force-element-nesting': 0,
        'force-pseudo-nesting': 0,
        'property-sort-order': 2,
        'quotes': [2, {'style': 'double'}],
        'shorthand-values': [2, {'allowed-shorthands': [4]}],
        'empty-line-between-blocks': 0
      }
    },
    eslint: {
      enabled: true, // Will disable itself if coffeescript is enabled
      rules: { // Override defaults from eslintrc
      }
    },
    coffeelint: {
      enabled: true, // Will disable itself if coffeescript is disabled
      rules: { // Override defaults from coffelint.json
        max_line_length: 'ignore'
      }
    }
  },

  test: { // Options for tests
    protractor: {
      baseUrl: 'http://localhost'
    }
  },

  build: { // Options for compiling the app
    gzip: true, // Enable gzip compression
    archive: true, // Zip up the app contents into build.zip (for uploading to GitHub releases)
    archiveName: 'build.zip', // Name of the archive (only .zip supported for now)
    folder: false, // str | function. A custom folder to build into. Useful when needing to deploy to a sub folder
  },

  deploy: { // Options for deploying the app
    cache: false, // Create a cache file .aws-publish-* to avoid reuploading unchanged files
    sync: false, // Overwrite the entire S3 bucket with every deploy
    slack: true, // Using SLACK_WEBHOOK_URL env variable, post a message to slack
  },

  extensions: { // Used as a reference for globs in a couple tasks
    scripts: ['js', 'coffee', 'js.coffee'],
    templates: ['html', 'haml', 'jade', 'pug', 'slim', 'jst', 'eco', 'jst.eco'],
    styles: ['css', 'scss', 'sass', 'css.scss', 'css.sass'],
    fonts: ['eot', 'svg', 'ttf', 'woff', 'woff2', 'otf'],
    images: ['jpg', 'jpeg', 'png', 'svg', 'gif']
  }
};

module.exports = settings;
