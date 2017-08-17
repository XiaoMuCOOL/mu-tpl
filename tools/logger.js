const chalk = require('chalk')
const format = require('util').format
const ora = require('ora')();

/**
 * Prefix.
 */

const prefix = '   mu-cli'
const sep = chalk.gray(' · ')

/**
 * Log a `message` to the console.
 *
 * @param {String} message
 */

exports.log = () => {
  let msg = format.apply(format, arguments)
  console.log(chalk.white(prefix),sep,msg)
}

/**
 * Log an error `message` to the console and exit.
 *
 * @param {String} message
 */

exports.fatal = (message)=> {
  if (message instanceof Error) message = message.message.trim()
    let msg = format.apply(format, arguments)
    console.error(chalk.red(prefix), sep, msg)
    process.exit(1)
}

/**
 * Log a success `message` to the console and exit.
 *
 * @param {String} message
 */

exports.success = () => {
  let msg = format.apply(format, arguments)
  console.log(chalk.green(prefix), sep, msg)
}
/**
 * 带图标的输出.
 *
 * @param {String} message
 */
exports.error = (message)=> {
  console.log()
  ora.fail(chalk.red(prefix+sep+message))
  process.exit(1)
}
exports.successd = (message)=> {
  console.log()
  ora.succeed(chalk.green(prefix+sep+message))
}
exports.warn = (message)=> {
  console.log()
  ora.warn(chalk.yellow(prefix+sep+message))
}
exports.info = (message)=> {
  console.log()
  ora.info(chalk.blue(prefix+sep+message))
}
