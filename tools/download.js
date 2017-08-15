'use strict'
const path = require('path')
const ora = require('ora')
const exists = require('fs').existsSync
const rm = require('rimraf').sync
const downloadGitRepo = require('download-git-repo')
const logger = require('./logger')

class Download {
  constructor () {
    this.visions = '0.0.1'
  }
  isLocalPath(templatePath) {
    return /^[./]|(^[a-zA-Z]:)/.test(templatePath)
  }
  getTemplatePath(templatePath) {
    return path.isAbsolute(templatePath)
      ? templatePath
      : path.normalize(path.join(process.cwd(), templatePath))
  }
  getTemplate (template,tmp,clone) {
    let spinner = ora('downloading template ...')
    spinner.start()
    if (exists(tmp)) rm(tmp)
    downloadGitRepo(template, tmp, { clone: clone }, function (err) {
      spinner.stop()
      if (err) logger.error('Failed to download repo ' + template + ': ' + err.message.trim())
      logger.successd('下载 ('+ template+') 模板成功!')
      // generate(name, tmp, to, function (err) {
      //   if (err) logger.fatal(err)
      //   console.log()
      //   logger.success('Generated "%s".', name)
      // })
    })
  }
}
const download = new Download()
module.exports = download