const path = require('path')
const {
  filenameToShellVariable,
  configFromEnvOrJsonFile
} = require('@cypress/env-or-json-file')
const la = require('lazy-ass')
const is = require('check-more-types')
const awspublish = require('gulp-awspublish')
const human = require('human-interval')

const isAWSKey = s => is.unemptyString(s) && s.length === 20

const isAWSSecret = s => is.unemptyString(s) && s.length === 40

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

function getS3Publisher (bucket, key, secret) {
  la(is.unemptyString(bucket), 'missing S3 bucket', bucket)
  la(isAWSKey(key), 'invalid AWS key')
  la(isAWSSecret(key), 'invalid AWS secret')

  return awspublish.create({
    httpOptions: {
      timeout: human('10 minutes')
    },
    params: {
      Bucket: bucket
    },
    accessKeyId: key,
    secretAccessKey: secret
  })
}

module.exports = { getS3Config, getS3Publisher }
