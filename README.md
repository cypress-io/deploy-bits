# @cypress/deploy-bits

> Reusable deployment utilities

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]

## Install

Requires [Node](https://nodejs.org/en/) version 6 or above.

```sh
npm install --save @cypress/deploy-bits
```

## Use

### Debugging

To debug functions from this module, run the program with `DEBUG=deploy-bits` environment
variable.

### isCI

Returns `true` if the code is running on a common continuous integration server.
Uses [is-ci](https://github.com/watson/is-ci).

```js
const {isCI} = require('@cypress/deploy-bits')
if (isCI) {
  // we are on CI
}
```

### warnIfNotCI

Prints a console warning if the code is not running on CI. Often we prefer deploying
from CI rather than running the deploy command locally.

```js
const {warnIfNotCI} = require('@cypress/deploy-bits')
warnIfNotCI()
```

### getDeployEnvironment

Returns target deployment environment `staging` or `production`

```js
const {getDeployEnvironment} = require('@cypress/deploy-bits')
getDeployEnvironment()
  .then(env => ...)
```

If the user specified environment using CLI `--environment <name>` option, it will be used.
Otherwise, user will be prompted to select one.

```
? Which environment are you deploying? 
❯ Staging 
  Production
```

You can pass list of arguments for this function to parse (by default it uses `process.argv`)
```js
getDeployEnvironment(['--environment', 'staging']) // yields "staging"
```
and you can even pass [minimist](https://github.com/substack/minimist) parsing options
```js
const options = {
  alias: {
    environment: 'e'
  }
}
getDeployEnvironment(['-e', 'staging']) // yields "staging"
```

### checkBranchEnvFolder

Checks the branch to environment mapping. For some branches checks if the working
directory is clean (no modified source files). Always returns input environment name.
Curried.

```js
const {checkBranchEnvFolder} = require('@cypress/deploy-bits')
checkBranchEnvFolder('master')('production')
// returns a promise resolved with "production"
// will throw an error if there are modified files
```

### getS3Config

Returns S3 config loaded from environment variable or local file. If cannot find either,
throws an error.

```js
const {getS3Config} = require('@cypress/deploy-bits')
const config = getS3Config()
```

Typical config file in `support/.aws-credentials.json` contains

```json
{
  "bucket-production": "<production S3 folder name>",
  "bucket-staging": "<staging S3 folder name>",
  "key": "AWS API key",
  "secret": "AWS API secret"
}
```

### getS3Publisher

Returns an instance of [gulp-awspublish](https://github.com/pgherveou/gulp-awspublish)

```js
const {getS3Config, getS3Publisher} = require('@cypress/deploy-bits')
const config = getS3Config()
const publisher = getS3Publisher(config['bucket-production'], config.key, config.secret)
```

### publishToS3

Uploads (diffs) a local folder to AWS S3 folder.

```js
const {getS3Config, getS3Publisher, publishToS3} = require('@cypress/deploy-bits')
const config = getS3Config()
const publisher = getS3Publisher(config['bucket-production'], config.key, config.secret)
publishToS3('dist/public', publisher)
// returns a promise
```

Note: if a local folder contains `build.json` it will be uploaded with "no cache" headers.

### Small print

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/cypress-io/deploy-bits/issues) on Github

## MIT License

Copyright (c) 2017 Cypress.io

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/@cypress/deploy-bits.svg?downloads=true
[npm-url]: https://npmjs.org/package/@cypress/deploy-bits
[ci-image]: https://travis-ci.org/cypress-io/deploy-bits.svg?branch=master
[ci-url]: https://travis-ci.org/cypress-io/deploy-bits
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
