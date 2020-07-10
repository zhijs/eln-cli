const validateProjectName = require('validate-npm-package-name')
const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const Creator = require('Creator')
const { getPromptModules } = require('./util/createTools')

const { chalk } = require('@eln/cli-shared-utils')
async function create(projectName, options) {
  const cwd = process.cwd()
  const inCurrent = projectName === '.'
  // 是 '.' 则取当前目录文件夹名称
  console.log('iscurrent', inCurrent)
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')
  console.log('name----', name)
  console.log('targetDir', targetDir)
  const result = validateProjectName(name)

  // 如果当前工程名字不合法
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`))
    result.errors && result.errors.forEach((err) => {
      console.log(chalk.red.dim('Error: ' + err))  
    })
    result.warnings && result.warnings.forEach((warn) => {
      console.log(chalk.red.dim('Warn: ' + warn))  
    })
  }

  // 如果当前目标目录已经存在
  if (fs.existsSync(targetDir) && !options.merge) {
    if (options.force) { // 是否是强制覆盖
      // await fs.remove(targetDir)
    } else {
      if (inCurrent) {
        const { ok } = await inquirer([{
          name: 'ok',
          type: 'confirm',
          message: 'Generate project in this directory?'  
        }])
        if (!ok) {
          return  
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${chalk.cyan(targetDir)} already exits. Pick an action:`,
            choices: [
              { name: 'Overwrite', value: 'overwrite' },
              { name: 'Merge', value: 'merge' },
              { name: 'Cancel', value: 'cancel' }  
            ] 
          }

        ])
        if (!action) {
          return  
        } else if(action === 'overwrite') {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
          // await fs.remove(targetDir)  
        }
      }
    }
  }
  console.log(result)
}

module.exports = (...args) => {
  return create(...args).catch(err => {

    if (err) {
      console.log(err)
      process.exit(1)
    }
  })
}