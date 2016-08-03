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

### Adding new pages to the guide
To add a new page to the guide, you have to add it to the `pages.json` file located in the `./src/` folder. Each entry in the JSON file should look like this:
```
[
    ...
    {
        "pageId": "example-page",              // The ID of the page that also will be used in the URL. Should be a slugged version of the title.
        "title": "Example Page",               // The title of the page
        "description": "Example description.", // The description of the page that will be shown on the home page.
        "text": "pages/example-page.md",       // The text which will be shown in the guide.
        "code": "pages/example-page.js",       // The code that will be shown in the editor beside the text.
        "readOnly": false                      // If the code in the editor should be editable and runnable or not.
    },
    ...
]
```
You also have to add the corresponding markdown and JavaScript file in the `./src/pages/` folder.
