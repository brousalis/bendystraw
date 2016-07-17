
# bendystraw [![NPM version](https://img.shields.io/npm/v/bendystraw.svg?style=flat-square)](https://www.npmjs.com/package/bendystraw)

<img src="http://i.imgur.com/Pdmetdq.png" alt="bendystraw" align="right" />
bendystraw is an opinionated set of [Gulp](https://github.com/gulpjs/gulp/) tasks for developing and deploying javascript apps

Some features include Babel & CoffeeScript support, Angular specific features, [Browersync](https://www.browsersync.io/) development, multiple app environments, GitHub changelog and release creation, AWS deployment, Slack integration, and more.

## Usage

    npm install --save-dev bendystraw

In order to use the gulp tasks, create a `gulpfile.js` with:

```
require('bendystraw')()
```

## Config

bendystraw assumes you have a defined `source` folder to use the tasks. By default, it looks like this:

![Imgur](http://i.imgur.com/tSW7amn.png)

You can generate this structure by using `gulp scaffold`, or you can override it to fit your needs. Here's an example configuration:

```javascript
require('bendystraw')({
  paths: {
    build: 'public', // Override the build folder name
    styles: 'css', // Override the stylesheet source folder
  },
  html: {
    preprocessor: require('gulp-jade'), // Use a custom html preprocessor
  },
  styles: {
    sassOptions: {
      indentedSyntax: true // Use .sass indented syntax
    },
    uncss: true, // Enable uncss
    autoprefixer: true
  },
  scripts: {
    babel: true, // Use babel es2015 preset
    coffeescript: false,
    sourcemaps: false
  }
})
```
Check out all the config values [here](https://github.com/brousalis/bendystraw/blob/master/gulpfile.js/config.js)

> NOTE: `gulp scaffold` will generate an `index.html` file. This shows how bendystraw uses `gulp-inject` and `gulp-useref` to inject your app's javascript and create bundles. Make sure to change the paths in the file if you've overridden the defaults. Read more about it on the [wiki](https://github.com/brousalis/bendystraw/wiki#asset-injection).

## Tasks

command | description
------- | ------------
`gulp` | defaults to server task
`gulp server` | builds the app to the dev folder and runs the Browsersync server
`gulp build` | builds, minifys the app to the build folder (for production)
`gulp release` | bumps version, tags, and creates a GitHub release based on your `package.json`
`gulp deploy` | deploys the build folder to a S3 bucket, posts to Slack if configured
`gulp test` | runs tests using Karma
`gulp e2e` | runs end to end tests with Protractor

All of these tasks can be run in different environments, ie: `gulp build --env staging`. This will then load `.env.staging` into the app.

To see a full list of tasks, check out the [wiki](https://github.com/brousalis/bendystraw/wiki).

## Examples

For more in-depth explanation of the tasks and examples on how to configure your app, check out the [wiki](https://github.com/brousalis/bendystraw/wiki). There's also an example Angular app I use for testing, [bendystraw-test](https://github.com/brousalis/bendystraw-test).

## Features

- **JS:**
  - Angular features (off by default)
    - Dependency injection annotations
    - File sorting to avoid injection issues
    - Compiles html files to the Angular templateCache
  - Babel es2015 support
  - CoffeeScript support
  - Sourcemaps
  - Bower components automatically injected through [wiredep](https://github.com/taptapship/wiredep)
  - Multiple script bundles created with [useref](https://github.com/jonkemp/useref)
- **CSS:**
  - Sass support, indented or scss using node-sass
  - Sourcemaps
  - Autoprefixer
  - Uncss
- **HTML:**
  - Any gulp-based html preprocessor support (gulp-haml, gulp-jade, etc)
- **Images:**
  - Image compression
  - Grabs images from specified Bower components
- **Development:**
  - Live reload with [Browsersync](https://www.browsersync.io/)
  - Support for multiple environments through [dotenv](https://github.com/motdotla/dotenv)
  - dotenv configuration output to window global or Angular constant for injection
  - Environment specific logic in the views
- **Releasing:**
  - GitHub semantic tagging and release creation (based on your `package.json`)
  - Changelog generation by comparing previous tag
- **Deployment:**
  - Amazon S3 bucket deploys
  - Asset revisioning
  - Cloudfront CDN url replacement support
  - Slack deployment messages
- **Testing:**
  - Karma tests
  - End to end testing with Protractor

## Thanks

bendystraw is inspired and based off of several Gulp projects. Big thanks to [gulp-starter](https://github.com/vigetlabs/gulp-starter/) by [vigetlabs](https://viget.com/extend) and [generator-gulp-angular](https://github.com/Swiip/generator-gulp-angular) by [Matthieu Lux](github.com/swiip)
