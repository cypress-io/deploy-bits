'use strict'

const getDeployEnvironment = require('./get-deploy-environment')
const checkBranchEnvFolder = require('./check-branch-env-folder')
const warnIfNotCI = require('./warn-if-not-ci')
const isCI = require('is-ci')
const getS3Config = require('./get-s3-config')

module.exports = {
  getDeployEnvironment,
  checkBranchEnvFolder,
  isCI,
  warnIfNotCI,
  getS3Config
}
