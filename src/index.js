'use strict'

const getDeployEnvironment = require('./get-deploy-environment')
const checkBranchEnvFolder = require('./check-branch-env-folder')
const warnIfNotCI = require('./warn-if-not-ci')
const isCI = require('is-ci')
const {
  getS3Config,
  getS3Publisher,
  publishToS3,
  uploadToS3
} = require('./s3-publish')
const { getBranch } = require('@cypress/commit-info')

module.exports = {
  getDeployEnvironment,
  checkBranchEnvFolder,
  isCI,
  warnIfNotCI,
  getS3Config,
  getS3Publisher,
  publishToS3,
  uploadToS3,
  getBranch
}
