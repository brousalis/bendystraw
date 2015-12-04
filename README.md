### bendystraw [![NPM version](https://img.shields.io/npm/v/bendystraw.svg?style=flat-square)](https://www.npmjs.com/package/bendystraw)
<br>

<img src="http://i.imgur.com/Pdmetdq.png" alt="bendystraw" align="left" />

> a set of [Gulp](https://github.com/gulpjs/gulp/) development and build tasks for Angular apps

to see an example of an Angular app using bendystraw, <br> check out the [example](https://github.com/brousalis/bendystraw/tree/example) branch


<br><br>

### usage

    npm install --save-dev bendystraw

in order to use the gulp tasks, create a `gulpfile.js` with:

```
require('bendystraw')()
```

to see an example of an Angular app using bendystraw, check out the [example](https://github.com/brousalis/bendystraw/tree/example) branch

### main tasks

command | description
------- | ------------
`gulp` | defaults to server task
`gulp server` | builds the app and runs the development server
`gulp build` | builds the app to `/build`
`gulp deploy` | deploys `/build` to an S3 bucket
`gulp test` | runs karma tests

### config

to configure settings and paths, pass an object into your require (most of the time in your gulpfile.js):
```javascript
require('bendystraw')({
  paths: {
    src: 'app', // override main app folder 
    dest: 'public', // override the build folder
    styles: 'css' // override the stylesheet folder
  },
  settings: {
    port: 42 // port to launch the server on
  }
})
```
check out the default config values [here](https://github.com/brousalis/bendystraw/blob/master/gulpfile.js/config.js)

### features
- **js:** 
  - built for Angular
    - dependency injection annotations
    - compiles html files to the template cache
    - automatic file sort to avoid injection issues
  - coffeescript support
  - bower components injected automatically
  - multiple bundles through useref
  - sourcemaps
- **css:** 
  - sass support, indented or scss
  - node-sass compiler
  - autoprefixer
  - sourcemaps
- **images:**
  - image compression
  - bower_component support
- **development:**
  - browsersync reload
  - server with multiple environments
- **staging/production**
  - support for multiple environments through dotenv
  - dotenv configuration output to Angular constants for injection
  - environment specific logic in the views
- **deployment:**
  - amazon S3 deploys
  - asset revisioning (cache busting)
  - cloudfront cdn support
- **testing:**
  - karma/phantomjs support
  - `.spec.js` style and `/tests` folder

### extra tasks

these tasks are used in the primary tasks, but you can run them manually.

command | description
------- | ------------
`gulp clean` | deletes the `/build` and `/.dev` folders
`gulp scripts` | compiles coffeescript files to javascript into the `./dev`
`gulp styles` | compiles sass files to css into the `/.dev`
`gulp templates` | compiles the html files then creates a templates.js file
`gulp fonts` | copies fonts from bower components into the build folder
`gulp scaffold` | creates folders/files based on the config
`gulp images` | copy images from bower components into dev folder
`gulp images:build` | optimize images and put them in the build folder
`gulp images:optimize` | optimizes images from source folder and into dev folder
`gulp env` | creates a env.js file from a .env file
`gulp vendor` | copies third party libs from the `/vendor` folder into dev folder
`gulp other` | copies extra folders/files in the source folder into build folder

### templates and templatecache

the template files in the project get minified, then output into a `templates.js` file, which looks something like this:

```javascript
angular.module("templates", [])
.run(["$templateCache", function($templateCache) {
  $templateCache.put("app/layouts/layout.html","<div ui-view=\"\"></div>");
}]);
```

you then reference the template in Angular using `templateUrl` and the full path (including .html)

this file gets bundled into your compiled app.js on build.

> **WARNING!** make sure you include the `templates` module into your Angular project before building production! you will be missing your template code if not.

### env configuration

bendystraw uses [dotenv](https://github.com/motdotla/dotenv) for app specific configuration. if you want to override variables per environment, create a `.env.environment`, then run any Gulp command with `--environment` (the word environment can anything). `.env` will be picked up automatically.

these variables will be dumped into an Angular module called `env` (can be configured). load that into your app, then you have access to the `ENV` and `NODE_ENV` constants.

something like this:

```coffeescript
angular.module 'testApp', [
  'templates'
  'env'
]
.config (ENV, NODE_ENV) ->
  console.log 'app config', ENV, NODE_ENV
```

> **WARNING!** do not put anything in this file you wouldn't want exposed to everyone! `.env` gets compiled and included in your source app.js. I realize this isn't the best way to handle this, and I'll hopefully improve it in the future.

### deployments

to utilize the `deploy` task, you'll need the following environment variables set:

```bash
// S3 bucket
AWS_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
    
// CDN (optional)
AWS_DISTRIBUTION_ID=
AWS_CLOUDFRONT_DOMAIN=
```

if you want to deploy a different environment, say `staging`, you need to configure your variables like this:

```bash
STAGING_AWS_BUCKET=
STAGING_AWS_ACCESS_KEY_ID=
STAGING_AWS_SECRET_ACCESS_KEY=
```

then you would run: `gulp deploy --staging`

### thanks

bendystraw is inspired and based off of many Gulp projects. [gulp-starter](https://github.com/vigetlabs/gulp-starter/) by [vigetlabs](https://viget.com/extend) and [generator-gulp-angular](https://github.com/Swiip/generator-gulp-angular) for Yeoman by [Matthieu Lux](github.com/swiip). built at [Belly](http://github.com/bellycard)
