const la = require('lazy-ass')
const is = require('check-more-types')
const Promise = require('bluebird')
const gift = require('gift')
const _ = require('lodash')
const chalk = require('chalk')

const repo = Promise.promisifyAll(gift(process.cwd()))

const isValidEnvironment = is.oneOf(['production', 'staging'])

const changedFilesMessage = `
Cannot deploy master to production.
You must first commit these above files.
`

const notOnMaster = `
Cannot deploy master to production.
You are not on the "master" branch.
`

function ensureCleanWorkingDirectory () {
  return repo.statusAsync().then(status => {
    if (!status.clean) {
      console.log(chalk.red('\nUncommited files:'))

      _.each(status.files, (props, file) => {
        console.log(chalk.red(`- ${file}`))
      })

      console.log('')

      throw new Error(changedFilesMessage)
    }
  })
}

const checkBranchEnvFolder = branch => env => {
  la(is.unemptyString('env'), 'missing environment', env)
  la(isValidEnvironment(env), 'invalid environment', env)

  if (env === 'staging') {
    return env
  }

  if (env === 'production') {
    if (branch !== 'master') {
      throw new Error(notOnMaster)
    }

    return ensureCleanWorkingDirectory().return(env)
  } else {
    throw new Error(`Unknown environment: ${env}`)
  }
}

module.exports = checkBranchEnvFolder
