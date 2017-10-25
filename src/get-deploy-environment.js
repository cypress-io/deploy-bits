const questionsRemain = require('@cypress/questions-remain')
const minimist = require('minimist')
const R = require('ramda')
const Promise = require('bluebird')
const inquirer = require('inquirer')
const debug = require('debug')('deploy-bits')

function prompt (questions) {
  return Promise.resolve(inquirer.prompt(questions))
}

function promptForDeployEnvironment () {
  return prompt({
    type: 'list',
    name: 'strategy',
    message: 'Which environment are you deploying?',
    choices: [
      { name: 'Staging', value: 'staging' },
      { name: 'Production', value: 'production' }
    ]
  }).get('strategy')
}

function cliOrAsk (property, ask, args, minimistOptions) {
  if (!args) {
    debug('using program.argv')
    args = process.argv.slice(2)
  }
  debug('args', args)

  // for now isolate the CLI/question logic
  const askRemaining = questionsRemain({
    [property]: ask
  })
  const options = minimist(args, minimistOptions)
  debug('parsed options', options)
  return askRemaining(options).then(R.prop(property))
}

const getDeployEnvironment = R.partial(cliOrAsk, [
  'environment',
  promptForDeployEnvironment
])

module.exports = getDeployEnvironment
