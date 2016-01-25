# Swiftype Search with WebHook

`search.js` is a sample of how Swiftype autocomplete search can be initialized to show search results that include a snippet of HTML.

`search.js` is currently written to expect being used with the dependencies listed below & the copy of `jquery.swiftype.autocomplete.js` included here. It is modified to include an event emitter that emits messages corresonding to the search results being shown & hidden.

```
npm install browserify brfs swig jquery --save
```

Configure browserify. In `package.json`, ensure your `browserify` entry includes the `brfs` transform. This allows the usage of `fs.readFileSync` to inline the `templateResult.html` file in your javascript so that it can be used in the browser, rather than writing your `swig` template directly in `search.js`.

```JSON
"browserify": {
  "transform": [
    "brfs"
  ]
}
```

& the `browser` entry of your `package.json` includes a key for `jquery.swiftype.autocomplete` that points to the `jquery.swiftype.autocomplete` that is included here. This allows you to `require('jquery.swiftype.autocomplete')` into your `search.js`.


```JSON
"browser": {
  "jquery.swiftype.autocomplete": "./path/to/jquery.swiftype.autocomplete.js"
}
```

If the default Swiftype configuration options are not suitable, look at the bottom of `jquery.swiftype.autocomplete.js` for a list of default options that can be overwritten.
