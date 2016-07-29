# Ericsson C3 Web SDK interactive guide
The guide is available at https://ericsson.github.io/c3-web-guide/.

The following (desktop) browsers are tested and supported:
* Chrome
* Firefox
* Opera
* Safari

## Developing locally
Download the repo and then run the following in the root directory of the project:
```
$ npm install
```
After you've downloaded the repo and have run `npm install` the following commands are available:
* `$ npm run start` - Starts a development server on `localhost:8080` with automatic browser reload on asset file change.
* `$ npm run build` - Creates a build in the `./dist/` folder.
* `$ npm run deploy` - Creates a build of the latest master branch and uploads it to GitHub pages at https://ericsson.github.io/c3-web-guide/.
