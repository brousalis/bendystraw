<img src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png" width="48">

### bendystraw 

a set of development and build tasks for Angular apps.

### usage 

    npm install --save-dev bendystraw

in order to use the gulp tasks, run:

    npm run bendystraw

which will create a `gulpfile.js` in your project that requires bendystraw.

you could also copy the `/gulpfile.js` folder and `package.json` into your own project.

### tasks

command | description
------- | ------------
`gulp`    | runs the development server
`gulp server` | also runs the development server
`gulp server:build` | runs a server with the production build
`gulp build` | builds the production app to `/build`
`gulp deploy` | deploys to an AWS bucket. configure via `.env`
`gulp test` | runs karma tests
`gulp clean` | deletes the `/build` and `/.dev` folders

### tasks

the gulp tasks take care of:

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

### assumptions

- angular app
- no html preprocessors 
- .sass syntax
- .coffee syntax
- file structure similar to the `/source` folder
- dotenv 

### configuration

create a `.env` file that includes:

    ANGULAR_MODULE_NAME=
    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    AWS_BUCKET=
