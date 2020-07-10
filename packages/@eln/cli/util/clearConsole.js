const { semver } = require('@eln/cli-shared-utils') // semver 语义化版本号管理的模块
const { loadOptions } = require('../options')
let sessionCached
module.exports = async function getVersion () {
  if (sessionCached) {
    return sessionCached  
  }
  let latest
  const local = require('../../package.json').version // 本地版本号
  const includePrerelease = !!semver.prerelease(local) // 是否有预发布版本号类似与 major-minor-patch-tag,如 1.0.0-beta
  const {latestVersion = local, lastChecked = 0 } = loadOptions()
}