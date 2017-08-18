const list = require('../tools/list')

class Prompts {
  constructor () {
    this.visions = '0.0.1'
  }
  getOfficialPrompts () {
    let choices = []
    for (let i in list) {
      let tpl = {
        name: list[i].name,
        value: list[i].url,
        short: list[i].name
      }
      choices.push(tpl)
    }
    let questions = [{
      type: 'input',
      name: 'projectName',
      message: 'Project name(项目名称) - ',
      default: 'mu-tpl'
    }, {
      type: 'input',
      name: 'author',
      message: 'Author(作者) - ',
      default: 'your name'
    }, {
      type: 'input',
      name: 'description',
      message: 'Project description(项目介绍) - ',
      default: '基于mu-tpl生成的项目'
    }, {
      type: 'list',
      name: 'template',
      message: 'Choose a template(选择一个模板) - ',
      choices: choices
    }, {
      type: 'confirm',
      name: 'newFolder',
      message: 'Generate project in new folder(新建文件夹创建项目)? ',
      default: true
    }, {
      type: 'confirm',
      name: 'auto',
      message: 'Auto npm install(自动安装依赖)? ',
      default: false
    }]
    return questions
  }
  getLocalPrompts () {

  }
  getAddTemplatePrompts () {
    let questions = [{
      type: 'input',
      name: 'name',
      message: 'Template name(模板名称) - ',
      default: 'mu-template',
      validate (value) {
        var pass = value.trim().match(/^[0-9a-zA-Z_-]+$/i)
        if (pass) {
          return true
        }
        return 'Please enter a letter、number or \'-_\'(请输入字母、数字或字符"_-")'
      },
      filter (params) {
        return params.trim()
      }
    }, {
      type: 'input',
      name: 'description',
      message: 'Template description(模板介绍) - ',
      default: 'a local template'
    }, {
      type: 'list',
      name: 'repo',
      message: 'Choose a repo(选择一个仓库) - ',
      choices: [{
        name: 'Github   (模板在Github上)',
        value: 'github:',
        short: 'github'
      }, {
        name: 'Local    (模板在本地磁盘上)',
        value: 'local:',
        short: 'local'
      }, {
        name: 'Gitlab   (模板在Gitlab上)',
        value: 'gitlab:',
        short: 'gitlab'
      }, {
        name: 'Bitbucket(模板在Bitbucket上)',
        value: 'bitbucket:',
        short: 'bitbucket'
      }]
    }, {
      type: 'input',
      name: 'url',
      message: 'Address(仓库地址格式):owner/name#branch - ',
      default: 'xiaomucool/mu-template#master',
      when: function (answers) {
        return answers.repo === 'github:'
      }
    }, {
      type: 'input',
      name: 'url',
      message: 'Absolute path(绝对路径) - ',
      default: 'D:\\template\\mu-tpl',
      validate (value) {
        var pass = value.trim().match(/^[./]|(^[a-zA-Z]:)/i)
        if (pass) {
          return true
        }
        return 'Error format(格式错误)'
      },
      when: function (answers) {
        return answers.repo === 'local:'
      }
    }, {
      type: 'input',
      name: 'url',
      message: 'Address(仓库地址格式):custom.com:owner/name#branch - ',
      default: '139.196.122.14:e3_frontend/e3_email_template#master',
      when: function (answers) {
        return answers.repo === 'gitlab:'
      }
    }, {
      type: 'input',
      name: 'url',
      message: 'Address(仓库地址格式):owner/name#branch - ',
      default: 'xiaomucool/mu-template#dev',
      when: function (answers) {
        return answers.repo === 'bitbucket:'
      }
    }, {
      type: 'confirm',
      name: 'confirm',
      message: 'Confirm add this template(确定添加模板)? ',
      default: true
    }]
    return questions
  }
}
const prompts = new Prompts()
module.exports = prompts
