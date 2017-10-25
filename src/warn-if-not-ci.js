const isCI = require('is-ci')
const chalk = require('chalk')

function warnIfNotCI () {
  if (isCI) {
    return
  }
  const msg = '⚠️ running deploy from CI server is STRONGLY preferred'
  console.log(chalk.yellow(msg))
  console.log('Please consult the documentation for details')
}

module.exports = warnIfNotCI
