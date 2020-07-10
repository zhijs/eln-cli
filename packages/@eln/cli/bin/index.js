#!/usr/bin/env node
const program = require('commander')

program
  .version(`@eln/cli ${require('../package').version}`)
  .usage('<command> [options]')


  program
  .command('create <app-name>')
  .description('create a new electron desktop project powered by eln-cli')
  .option('-f --force', 'Overwrite target directory if it exits')
  .option('--merge', 'Merge target directory if it exists')
  .action((name, cmd) => {
    console.log('cmd---', cmd)
    const options = clearArgs(cmd)
    console.log('cmd option', cmd.options)
    require('../lib/create')(name, options)
  })

  /**
   * 参数处理，只返回必要的参数
   * cmd 对象引用了 options 对象，该对象里面有所有的参数描述
   * 但是值却在 cmd 对象中，同时 --merge 参数，在 cmd 指的键是 merge
   * create test --merge
   * cmd = {
   *   merge: true,
   *   options: {
   *     flags: '--merge',
   *    required: false,
   *    optional: false,
   *    mandatory: false,
   *    negate: false,
   *    long: '--merge',
   *    description: 'Merge target directory if it exists'
   *  }
   * }
   */
  function clearArgs(cmd) {
    const args = {}
    cmd.options.forEach(o => {
      const key = o.long.replace(/^--/, '') // 参数 key 转化，例如 --merge -> merge
      if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
        args[key] = cmd[key]  
      }
    });
    return args 
  }

  program.parse(process.argv)