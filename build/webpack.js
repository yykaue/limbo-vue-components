const Compiler = require('./compiler')

// lib/webpack.js
function webpack (options) {
  // 1、合并配置项
  const mergeOptions = _mergeOptions(options)
  // 2、创建 compiler
  const compiler = new Compiler(mergeOptions)
  // 3、注册插件，让插件去影响打包结果
  if (Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      if (typeof plugin === 'function') {
        plugin.call(compiler, compiler) // 当插件为函数时
      } else {
        plugin.apply(compiler) // 如果插件是一个对象，需要提供 apply 方法。
      }
    }
  }
  return compiler
}

function _mergeOptions (options) {
  const shellOptions = process.argv.slice(2).reduce((option, argv) => {
    // argv -> --mode=production
    const [key, value] = argv.split('=')
    if (key && value) {
      const parseKey = key.slice(2)
      option[parseKey] = value
    }
    return option
  }, {})
  return { ...options, ...shellOptions }
}

module.exports = webpack
