class Prompts {
  constructor () {
    this.visions = '0.0.1'
  }
  getOfficialPrompts () {
    let questions = [{
      type:"input",
      name:"projectName",
      message:"Project name(项目名称) - ",
      default:"Mu-CLI"
    },{
      type:"input",
      name:"author",
      message:"Author(作者) - ",
      default:"your name"
    },{
      type:"input",
      name:"description",
      message:"Project description(项目介绍) - ",
      default:"基于Mu-CLI生成的项目"
    },{
      type:"list",
      name:"template",
      message:"Choose a template(选择一个模板) - ",
      choices:[{
        name:"mu-jquery",
        value: "gitlab:139.196.122.14:e3_frontend/e3_email_template",
        short: "jquery"
      },{
        name:"local",
        value: "D:\\xiaomucool\\mu-cli",
        short: "local"
      }]
    },{
      type:"confirm",
      name:"newFolder",
      message:"Generate project in new folder(新建文件夹创建项目)? ",
      default:true
    },{
      type:"confirm",
      name:"auto",
      message:"Auto npm install(自动安装依赖)? ",
      default:false
    }]
    return questions
  }
  getLocalPrompts () {

  }
  getAddTemplatePrompts () {
    
  }
}
const prompts = new Prompts()
module.exports = prompts