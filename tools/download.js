'use strict'
const path = require('path')
const ora = require('ora')
const updater = require('pkg-updater')
const home = require('user-home')
const pkg = require('../package')
const exists = require('fs').existsSync
const rm = require('rimraf').sync
const downloadGitRepo = require('download-git-repo')
const logger = require('./logger')
const async = require('async')
const render = require('consolidate').handlebars.render
const Metalsmith = require('metalsmith')
const exec = require('child_process').exec
const request = require('request')
const fs = require('fs')

class Download {
  constructor () {
    this.visions = '0.0.1'
    this.update()
  }
  getTemplateRepo (url) {
    let index = url.indexOf(':')
    let repo = url.substr(0, index)
    let uri = url.substr(index + 1, url.length)
    let obj = {
      repo: repo,
      uri: uri,
      url: url,
      clone: repo === 'gitlab'
    }
    return obj
  }
  getTemplatePath (templatePath) {
    return path.isAbsolute(templatePath)
      ? templatePath
      : path.normalize(path.join(process.cwd(), templatePath))
  }
  getTemplate (info, tmp, done) {
    let spinner = ora('downloading template(正在下载模板中) ...')
    spinner.start()
    if (exists(tmp)) rm(tmp)
    downloadGitRepo(info.url, tmp, { clone: info.clone }, function (err) {
      spinner.stop()
      if (err) logger.error('Failed to download repo ' + info.url + ' (下载模板失败): ' + err.message.trim())
      logger.successd('Successd to download repo ' + info.url + ' (下载模板成功)!')
      done()
    })
  }
  getTemplateFiles () {
    return function (files, metalsmith, done) {
      let keys = Object.keys(files)
      let metalsmithMetadata = metalsmith.metadata()
      async.each(keys, function (file, next) {
        var str = files[file].contents.toString()
        if (!/(index|header|package|home)\./g.test(file) || !/{{([^{}]+)}}/g.test(str)) {
          return next()
        }
        render(str, metalsmithMetadata, function (err, res) {
          if (err) {
            err.message = `[${file}] ${err.message}`
            return next(err)
          }
          files[file].contents = Buffer.from(res)
          next()
        })
      }, done)
    }
  }
  moveLocalFiles (obj) {
    let that = this
    Metalsmith('.')
    .metadata(obj.metadata)
    .source(obj.src)
    .ignore('**/.git/**/*')
    .destination(obj.dest)
    .clean(false)
    .use(that.getTemplateFiles())
    .build(function (err, files) {
      if (err) logger.error(err)
      for (let file of obj.del) {
        rm('./' + obj.dest + '/' + file)
      }
      logger.successd('Success to Generate project(成功生成项目)!')
      // 自动安装npm
      if (obj.auto) {
        that.autoInstall(obj.dest)
      }
    })
  }
  autoInstall (projectName) {
    console.log()
    let spinner = ora('Auto npm install(自动安装依赖中) ...')
    spinner.start()
    let cmdStr = 'cd ' + projectName + ' && npm i'
    exec(cmdStr, (err, stdout, stderr) => {
      spinner.stop()
      if (err) logger.error(err)
      logger.successd('Successd to npm install(依赖安装成功)!')
    })
  }
  update (cb) {
    updater({
      'pkg': pkg,
      'level': 'patch',
      'updateMessage': 'Package update available(有可用更新):' +
      '<%=colors.dim(current)%> -> <%=colors.green(latest)%>' +
      '\n\nRun(运行) <%=colors.cyan(command)%>'
    }).then(() => {})
  }
  getListJsonPath () {
    return path.join(home, '.mu', 'list.json')
  }
  getListJson (cb) {
    let isChange = false
    request({
      url: 'https://raw.githubusercontent.com/XiaoMuCOOL/mu-templates/master/list.json',
      headers: {
        'User-Agent': 'mu-tpl'
      }
    }, (err, res, body) => {
      if (err) logger.fatal('fatal to download file(文件下载失败).')
      let reqTpl = JSON.parse(body)
      let localTpl
      try {
        localTpl = require(this.getListJsonPath())
        for (let tpl in reqTpl) {
          if (!localTpl[tpl]) {
            localTpl[tpl] = reqTpl[tpl]
            isChange = true
          }
        }
        if (isChange) {
          fs.writeFile(
            this.getListJsonPath(),
            JSON.stringify(localTpl),
            'utf-8',
            err => {
              if (err) logger.fatal('fatal to write file(文件写入失败).')
            }
          )
        }
      } catch (error) {
        localTpl = reqTpl
        if (!fs.existsSync(path.join(home, '.mu'))) fs.mkdirSync(path.join(home, '.mu'))
        fs.writeFile(
          this.getListJsonPath(),
          JSON.stringify(localTpl),
          'utf-8',
          err => {
            if (err) logger.fatal('fatal to write file(文件写入失败).')
          }
        )
      }
      cb(localTpl)
    })
  }
}
const download = new Download()
module.exports = download
