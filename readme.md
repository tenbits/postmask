### PostMask
-----
[![Build Status](https://travis-ci.org/tenbits/postmask.svg?branch=master)](https://travis-ci.org/tenbits/postmask)
[![NPM version](https://badge.fury.io/js/postmask.svg)](http://badge.fury.io/js/postmask)


Runs mask optimizers


### API

```js
var postmask = require('postmask');

postmask
    .processSource(template, path, options)
    .then(ast => {}, error => {});

OptionsExample = {
    plugins: [ "postmask-babel" ],
    minify: false
};
```


----
_(c) MIT License - Atma.js Project_