'use strict'

/* eslint-env mocha */
const la = require('lazy-ass')
const is = require('check-more-types')
const snapshot = require('snap-shot-it')
const { map, type } = require('ramda')

describe('@cypress/deploy-bits', () => {
  it('has public API', () => {
    const api = require('.')
    const schema = map(type, api)
    snapshot(schema)
  })

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
