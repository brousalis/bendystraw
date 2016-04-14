
# bendystraw [![NPM version](https://img.shields.io/npm/v/bendystraw.svg?style=flat-square)](https://www.npmjs.com/package/bendystraw)

<img src="http://i.imgur.com/Pdmetdq.png" alt="bendystraw" align="right" />
bendystraw is a set of [Gulp](https://github.com/gulpjs/gulp/) tasks for developing and deploying JavaScript-based apps.

Some features include [Browersync](https://www.browsersync.io/) development, multiple app environments and configuration, GitHub changelog and release creation, Slack integration, and much more...

## Usage

    npm install --save-dev bendystraw

In order to use the gulp tasks, create a `gulpfile.js` with:

```
require('bendystraw')()
```

## Tasks

command | description
------- | ------------
`gulp` | defaults to server task
`gulp server` | builds the app to the dev folder and runs the Browsersync server
`gulp build` | builds the app to the build folder
`gulp release` | bumps version, tags, and creates a GitHub release based on `package.json`
`gulp deploy` | deploys the build folder to a S3 bucket, posts to Slack if configured
`gulp test` | runs tests using Karma
`gulp e2e` | run end to end tests with Protractor

All of these tasks can be run in different environments, ie: `gulp build --env staging`. This will then load `.env.staging` into the app.

To see a full list of tasks, check out the [wiki](https://github.com/brousalis/bendystraw/wiki).

## Config

To configure settings, paths, etc...
```javascript
require('bendystraw')({
  paths: {
    build: 'public', // Override the build folder name
    styles: 'stylez', // Override the stylesheet source folder
  },
  html: {
    preprocessor: require('gulp-jade'),
  },
  scripts: {
    coffeescript: true, 
    sourcemaps: false
  }
})
```
Check out all the config values [here](https://github.com/brousalis/bendystraw/blob/master/gulpfile.js/config.js)

## Examples

For more in-depth explanation of the tasks and examples on how to configure your app, check out the [wiki](https://github.com/brousalis/bendystraw/wiki). There's also an example Angular app I use for testing, [bendystraw-test](https://github.com/brousalis/bendystraw-test).

## Features

- **JS:**
  - Built-in Angular features
    - Dependency injection annotations
    - Automatic file sorting to avoid injection issues
  - CoffeeScript support
  - Sourcemaps
  - Bower components automatically injected through [wiredep](https://github.com/taptapship/wiredep)
  - Multiple script bundles created with [useref](https://github.com/jonkemp/useref)
- **CSS:**
  - Sass support, indented or scss using node-sass
  - Sourcemaps
  - Autoprefixer
- **HTML:**
  - Any gulp-based preprocessor supported (gulp-haml, gulp-jade, etc)
  - Minifies and compiles html template files to the Angular template cache
- **Images:**
  - Image compression
  - Grabs images from specified Bower components
- **Development:**
  - Live reload with [Browsersync](https://www.browsersync.io/)
  - Support for multiple environments through [dotenv](https://github.com/motdotla/dotenv)
  - dotenv configuration output to window global or Angular constant for injection
  - Environment specific logic in the views
- **Releasing:**
  - GitHub tag and release support
  - Changelog generation
- **Deployment:**
  - Amazon S3 bucket deploys
  - Asset revisioning (cache busting)
  - Cloudfront CDN support
  - Slack deployment messages
- **Testing:**
  - Karma tests
  - End to end testing with Protractor
  - `.spec.js` style and `/test` folder

## Thanks

bendystraw is inspired and based off of many Gulp projects. [gulp-starter](https://github.com/vigetlabs/gulp-starter/) by [vigetlabs](https://viget.com/extend) and [generator-gulp-angular](https://github.com/Swiip/generator-gulp-angular) for Yeoman by [Matthieu Lux](github.com/swiip). built at [Belly](http://github.com/bellycard)
