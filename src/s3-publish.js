//
// code related to uploading (publishing) a folder to S3 folder
//
const path = require('path')
const {
  filenameToShellVariable,
  configFromEnvOrJsonFile
} = require('@cypress/env-or-json-file')
const la = require('lazy-ass')
const is = require('check-more-types')
const awspublish = require('gulp-awspublish')
const human = require('human-interval')
const gulp = require('gulp')
const merge = require('merge-stream')

const isAWSKey = s => is.unemptyString(s) && s.length === 20

const isAWSSecret = s => is.unemptyString(s) && s.length === 40

const isConfig = is.schema({
  'bucket-production': is.unemptyString,
  'bucket-staging': is.unemptyString,
  key: is.unemptyString,
  secret: is.unemptyString
})

const isPublisher = is.schema({
  publish: is.fn
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

function publishToS3 (distDir, publisher) {
  la(is.unemptyString(distDir), 'missing directory to publish to S3', distDir)
  la(isPublisher(publisher), 'not an instance of gulp-awspublish')

  const headers = {}
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
  const nocacheHeaders = {
    'Cache-Control':
      'max-age=0, no-cache, no-store, no-transform, must-revalidate'
  }

  return new Promise((resolve, reject) => {
    const files = path.join(distDir, '**', '*')
    const buildJsonFile = path.join(distDir, 'build.json')
    const noBuildJsonFile = `!${buildJsonFile}`

    // merging deployment streams
    // https://github.com/pgherveou/gulp-awspublish#upload-both-gzipped-and-plain-files-in-one-stream
    const mostFiles = gulp
      .src([files, noBuildJsonFile])
      .pipe(publisher.publish(headers))
    const buildJson = gulp
      .src(buildJsonFile)
      .pipe(publisher.publish(nocacheHeaders))

    merge(mostFiles, buildJson)
      // we dont need to gzip here because cloudflare
      // will automatically gzip the content for us
      // after its cached at their edge location
      // but we should probably gzip the index.html?
      // .pipe(awspublish.gzip({ext: '.gz'}))
      .pipe(awspublish.reporter())
      .on('error', reject)
      .on('end', resolve)
  })
}

module.exports = { getS3Config, getS3Publisher, publishToS3 }
