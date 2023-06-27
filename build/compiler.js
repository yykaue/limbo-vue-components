const fs = require('fs')
const path = require('path')
const { SyncHook } = require('tapable') // 串联 compiler 打包流程的订阅与通知钩子
const Compilation = require('./compilation') // 编译构造函数

class Compiler {
  constructor (options) {
    this.options = options
    this.context = this.options.context || process.cwd().replace(/\\/g, '/')
    this.hooks = {
      // 开始编译时的钩子
      run: new SyncHook(),
      // 模块解析完成，在向磁盘写入输出文件时执行
      emit: new SyncHook(),
      // 在输出文件写入完成后执行
      done: new SyncHook()
    }
  }

  run (callback) {
    // 触发 run hook
    this.hooks.run.call()
    // 创建 compilation 编译对象
    const compilation = new Compilation(this)
    // 编译模块
    compilation.build()
    // 生成产物
    compilation.seal()
    // 输出产物
    this.emitAssets(compilation, callback)
  }

  emitAssets (compilation, callback) {
    const { entries, modules, chunks, assets } = compilation
    const output = this.options.output

    // 调用 Plugin emit 钩子
    this.hooks.emit.call()

    // 若 output.path 不存在，进行创建
    if (!fs.existsSync(output.path)) {
      fs.mkdirSync(output.path)
    }

    // 将 assets 中的内容写入文件系统中
    Object.keys(assets).forEach((fileName) => {
      const filePath = path.join(output.path, fileName)
      fs.writeFileSync(filePath, assets[fileName])
    })

    // 结束之后触发钩子
    this.hooks.done.call()

    callback(null, {
      toJSON: () => {
        return {
          entries,
          modules,
          chunks,
          assets
        }
      }
    })
  }
}

module.exports = Compiler
