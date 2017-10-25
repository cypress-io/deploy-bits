'use strict'

const getDeployEnvironment = require('./get-deploy-environment')
const checkBranchEnvFolder = require('./check-branch-env-folder')
const warnIfNotCI = require('./warn-if-not-ci')
const isCI = require('is-ci')

module.exports = {
  getDeployEnvironment,
  checkBranchEnvFolder,
  isCI,
  warnIfNotCI
}
