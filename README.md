### bendystraw 

![bendystraw](http://i.imgur.com/Pdmetdq.png)

a set of [Gulp](https://github.com/gulpjs/gulp/) development and build tasks for Angular apps

### usage

    npm install --save-dev bendystraw

in order to use the gulp tasks, run:

    npm run bendystraw

which will create a `gulpfile.js` in your project that requires bendystraw.

you could also copy the `/gulpfile.js` folder and `package.json` into your own project.

to see an example of an Angular app using bendystraw, check out the [example](https://github.com/brousalis/bendystraw/tree/example) branch

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
`gulp deploy:staging` | builds and deploys staging build to an AWS bucket
`gulp deploy:production` | builds and deploys production build to an AWS bucket
`gulp images` | optimize images and put them in the build folder
`gulp images:copy` | copy images from bower components into dev folder
`gulp images:optimize` | optimizes images from source folder and into dev folder
`gulp tests:watch` | runs karma tests and waits/watches for changes

the gulp tasks take care of:

- development, staging, and production environments
- angular templatecache for markup files
- ng-annotate for proper dependency injection
- coffeescript linting/compiling
- sass linting/compiling
- autoprefixing
- html/js/css minification
- image optimization
- wiredep for bower_components
- inject for bundling js/css
- karma for testing
- aws builds/gzip

### configuration

create a `env.json` file is similar to:

    {
      "development": {
        "ENV": {
          "API_URL": "https://localhost:3000",
        }
      },
      "production": {
        "ENV": {
          "API_URL": "https://localhost:3000",
        }
      }
    }

then in your Angular app, you can reference it by first requiring the `env` module, then adding a dependency of `ENV`.
