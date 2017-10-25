'use strict'

const getDeployEnvironment = require('./get-deploy-environment')
const checkBranchEnvFolder = require('./check-branch-env-folder')
const isCI = require('is-ci')

module.exports = {
  getDeployEnvironment,
  checkBranchEnvFolder,
  isCI
}
