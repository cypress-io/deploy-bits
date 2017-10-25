'use strict'

const snapshot = require('snap-shot-it')

/* eslint-env mocha */
const getDeployEnvironment = require('./get-deploy-environment')

describe('get-deploy-environment', () => {
  it('parses given arguments', () =>
    getDeployEnvironment(['--environment', 'staging']).then(snapshot))

  it('can use parsing options', () => {
    const options = {
      alias: {
        environment: 'e'
      }
    }
    return getDeployEnvironment(['-e', 'staging'], options).then(snapshot)
  })
})
