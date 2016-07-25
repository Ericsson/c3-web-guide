## Installation
To use the C3 Web SDK you have to add it to your app. There are two ways to do this:

### Install using npm
The package is currently scoped to `@cct` and published at `https://npm.cct.ericsson.net`, so first you need to set the registry config for the `@cct` scope using:

```
$ npm config set @cct:registry https://npm.cct.ericsson.net
```

Once that is done you can install the C3 Web SDK with:

```
$ npm install @cct/libcct --save
```

You can now either refer to the JavaScript files inside `node_modules/@cct/libcct/dist` or import `@cct/libcct` as a module.

### Link directly in page
Alternatively you can include the C3 Web SDK by linking it directly like this:

```
<script src="https://get.cct.ericsson.net/latest/cct.js"></script>
```
After you have included the SDK you're good to go!
