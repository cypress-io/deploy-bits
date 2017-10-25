const path = require('path')
const {
  filenameToShellVariable,
  configFromEnvOrJsonFile
} = require('@cypress/env-or-json-file')
const is = require('check-more-types')

const isConfig = is.schema({
  'bucket-production': is.unemptyString,
  'bucket-staging': is.unemptyString,
  key: is.unemptyString,
  secret: is.unemptyString
})

function getS3Config () {
  const key = path.join('support', '.aws-credentials.json')
  const config = configFromEnvOrJsonFile(key)
  if (!config) {
    console.error('⛔️  Cannot find AWS credentials')
    console.error('Using @cypress/env-or-json-file module')
    console.error('and key', filenameToShellVariable(key))
    throw new Error('AWS config not found')
  }
  if (!isConfig(config)) {
    console.error('⛔️  Invalid AWS credentials')
    console.error('Have keys', Object.keys(config))
    throw new Error('Invalid AWS config')
  }
  return config
}

module.exports = getS3Config
