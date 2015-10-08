## bendystraw

a set of development and build tasks for Angular apps. WIP

    npm install --save-dev bendystraw
  
in order to access the gulp tasks, run

    npm run bendystraw
    
which will create a `gulpfile.js` in your project
    
### features

to see an example of how an app could be structured, take a look at the `source` folder. 

the gulp tasks take care of:

- angular templatecache for templates
- angular annotation of dependency injection
- coffeescript
- js minification
- .sass syntax
- css autoprefixing
- css minification
- image optimization
- template (jade or html) minification
- injection of bower components through wiredep
- karma testing
- aws builds/gzip

### tasks

command | description
------- | ------------
`gulp`    | runs the development server
`gulp server` | also runs the development server
`gulp server:build` | runs a server with the production build
`gulp build` | builds the production app to `/build`
`gulp deploy` | deploys to an AWS bucket. configure via `.env`
`gulp test` | runs karma tests
`gulp clean` | deletes the `/build` and `/.tmp` folders

### configuration

create a `.env` file that includes:

    ANGULAR_MODULE_NAME=
    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    AWS_BUCKET=
