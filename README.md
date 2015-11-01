### bendystraw [![NPM version](https://img.shields.io/npm/v/bendystraw.svg?style=flat-square)](https://www.npmjs.com/package/bendystraw)
<br>

<img src="http://i.imgur.com/Pdmetdq.png" alt="bendystraw" align="left" />

> a set of [Gulp](https://github.com/gulpjs/gulp/) development and build tasks for Angular apps

to see an example of an Angular app using bendystraw, <br> check out the [example](https://github.com/brousalis/bendystraw/tree/example) branch


<br><br>

### usage

    npm install --save-dev bendystraw

in order to use the gulp tasks, create a `gulpfile.js` with:

    require('bendystraw')

or if you're lazy

```bash
echo "require('bendystraw')" >> gulpfile.js
```

to see an example of an Angular app using bendystraw, check out the [example](https://github.com/brousalis/bendystraw/tree/example) branch

### config

to configure settings and paths, pass an object into your require to bendystraw (most of the time in your gulpfile.js):
```javascript
require('bendystraw')({
  paths: {
    src: 'app', // override main app folder 
    dest: 'public', // override the build folder
    styles: 'css' // override the stylesheet folder
  },
  settings: {
    port: '42' // port to launch the server on
  }
})
```
check out the default config values [here](https://github.com/brousalis/bendystraw/blob/master/gulpfile.js/config.js)

### tasks

command | description
------- | ------------
`gulp` | runs the development server
`gulp staging` | runs the server in staging context
`gulp production` | runs the server in production context
`gulp build` | builds the app to `/build`
`gulp deploy` | deploys `/build` to an AWS bucket
`gulp tests` | runs karma tests
`gulp clean` | deletes the `/build` and `/.dev` folders

### extra tasks

command | description
------- | ------------
`gulp server` | also runs the development server
`gulp server:staging` | runs a server with the staging build
`gulp server:production` | runs a server with the production build
`gulp build:staging` | builds the staging app to `/build`
`gulp build:production` | builds the production app to `/build`
`gulp deploy:staging` | builds and deploys staging build to an S3 bucket
`gulp deploy:production` | builds and deploys production build to an S3 bucket
`gulp images` | optimize images and put them in the build folder
`gulp images:copy` | copy images from bower components into dev folder
`gulp images:optimize` | optimizes images from source folder and into dev folder
`gulp tests:watch` | runs karma tests and waits/watches for changes

the gulp tasks take care of:

- development, staging, and production environments
- angular templatecache for markup files
- ng-annotate for proper dependency injection
- coffeescript compiling
- sass compiling
- css vendor autoprefixing
- html/js/css minification
- image optimization
- wiredep for injecting bower_components
- gulp-inject for bundling js/css
- karma for testing
- aws builds/gzip
- cloudfront integration and url replacement

### env configuration

uses [dotenv](https://github.com/motdotla/dotenv) for app specific configuration. if you want to override env variables per environment, create a `.env.staging` and `.env.production`.

these variables will be dumped into an Angular module called `env` (can be configured). load that into your app, then you have access to the `ENV` and `NODE_ENV` constants.

to utilize the `deploy` task, you'll need the following environment variables set (through dotenv or however):

    // s3 bucket
    AWS_BUCKET=
    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    
    // CDN
    AWS_DISTRIBUTION_ID=
    AWS_CLOUDFRONT_DOMAIN=

### thanks

bendystraw is inspired and based off of many Gulp projects. [gulp-starter](https://github.com/vigetlabs/gulp-starter/) by [vigetlabs](https://viget.com/extend) and [generator-gulp-angular](https://github.com/Swiip/generator-gulp-angular) for Yeoman by [Matthieu Lux](github.com/swiip). built at [Belly](http://github.com/bellycard)
