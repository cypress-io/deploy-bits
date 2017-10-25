'use strict'

/* eslint-env mocha */
const la = require('lazy-ass')
const is = require('check-more-types')

describe('@cypress/deploy-bits', () => {
  context('isCI', () => {
    const { isCI } = require('.')
    it('is a boolean', () => {
      la(is.bool(isCI))
    })
  })

  context('warnIfNotCI', () => {
    const { warnIfNotCI } = require('.')
    it('is a function', () => {
      la(is.fn(warnIfNotCI))
    })
  })
})
