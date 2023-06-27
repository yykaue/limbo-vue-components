const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const t = require('@babel/types')
const { tryExtensions, getSourceCode } = require('./utils')

class Compilation {
  constructor (compiler) {
    this.compiler = compiler
    this.context = compiler.context
    this.options = compiler.options
    // 记录当前 module code
    this.moduleCode = null
    // 保存所有依赖模块对象
    this.modules = new Set()
    // 保存所有入口模块对象
    this.entries = new Map()
    // 所有的代码块对象
    this.chunks = new Set()
    // 存放本次产出的文件对象（与 chunks 一一对应）
    this.assets = {}
  }

  build () {
    // 1、读取配置入口
    const entry = this.getEntry()
    // 2、构建入口模块
    Object.keys(entry).forEach((entryName) => {
      const entryPath = entry[entryName]
      const entryData = this.buildModule(entryName, entryPath)
      this.entries.set(entryName, entryData)
    })
  }

  getEntry () {
    let entry = Object.create(null)
    const { entry: optionsEntry } = this.options
    if (!optionsEntry) {
      entry.main = 'src/index.js' // 默认找寻 src 目录进行打包
    } else if (typeof optionsEntry === 'string') {
      entry.main = optionsEntry
    } else {
      entry = optionsEntry // 视为对象，比如多入口配置
    }
    // 相对于项目启动根目录计算出相对路径
    Object.keys(entry).forEach((key) => {
      entry[key] = './' + path.posix.relative(this.context, entry[key])
    })
    return entry
  }

  buildModule (moduleName, modulePath) {
    // 1. 读取文件原始代码
    const originSourceCode = fs.readFileSync(modulePath, 'utf-8')
    this.moduleCode = originSourceCode
    // 2. 调用 loader 进行处理
    this.runLoaders(modulePath)
    // 3. 调用 webpack 进行模块编译 为模块创建 module 对象
    const module = this.handleWebpackCompiler(moduleName, modulePath)
    return module // 返回模块
  }

  runLoaders (modulePath) {
    const matchLoaders = []
    // 1、找到与模块相匹配的 loader
    const rules = this.options.module.rules
    rules.forEach((loader) => {
      const testRule = loader.test
      if (testRule.test(modulePath)) {
        // 如：{ test:/\.js$/g, use:['babel-loader'] }, { test:/\.js$/, loader:'babel-loader' }
        loader.loader ? matchLoaders.push(loader.loader) : matchLoaders.push(...loader.use)
      }
    })
    // 2. 倒序执行 loader
    for (let i = matchLoaders.length - 1; i >= 0; i--) {
      const loaderFn = require(matchLoaders[i])
      // 调用 loader 处理源代码
      this.moduleCode = loaderFn(this.moduleCode)
    }
  }

  handleWebpackCompiler (moduleName, modulePath) {
    // 1、创建 module
    const moduleId = './' + path.posix.relative(this.context, modulePath)
    const module = {
      id: moduleId, // 将当前模块相对于项目启动根目录计算出相对路径 作为模块ID
      dependencies: new Set(), // 存储该模块所依赖的子模块
      entryPoint: [moduleName] // 该模块所属的入口文件
    }

    // 2、对模块内容解析为 AST，收集依赖模块，并改写模块导入语法为 __webpack_require__
    const ast = parser.parse(this.moduleCode, {
      sourceType: 'module'
    })

    // 遍历 ast，识别 require 语法
    traverse(ast, {
      CallExpression: (nodePath) => {
        const node = nodePath.node
        if (node.callee.name === 'require') {
          const requirePath = node.arguments[0].value
          // 寻找模块绝对路径
          const moduleDirName = path.posix.dirname(modulePath)
          const absolutePath = tryExtensions(
            path.posix.join(moduleDirName, requirePath),
            this.options.resolve.extensions,
            requirePath,
            moduleDirName
          )
          // 创建 moduleId
          const moduleId = './' + path.posix.relative(this.context, absolutePath)
          // 将 require 变成 __webpack_require__ 语句
          node.callee = t.identifier('__webpack_require__')
          // 修改模块路径（参考 this.context 的相对路径）
          node.arguments = [t.stringLiteral(moduleId)]

          if (!Array.from(this.modules).find(module => module.id === moduleId)) {
            // 在模块的依赖集合中记录子依赖
            module.dependencies.add(moduleId)
          } else {
            // 已经存在模块集合中。虽然不添加进入模块编译 但是仍要在这个模块上记录被依赖的入口模块
            this.modules.forEach((module) => {
              if (module.id === moduleId) {
                module.entryPoint.push(moduleName)
              }
            })
          }
        }
      }
    })

    // 3、将 ast 生成新代码
    const { code } = generator(ast)
    module._source = code

    // 4、深度递归构建依赖模块
    module.dependencies.forEach((dependency) => {
      const depModule = this.buildModule(moduleName, dependency)
      // 将编译后的任何依赖模块对象加入到 modules 对象中去
      this.modules.add(depModule)
    })

    return module
  }

  seal () {
    // 1、根据 entry 创建 chunk
    this.entries.forEach((entryData, entryName) => {
      // 根据当前入口文件和模块的相互依赖关系，组装成为一个个包含当前入口所有依赖模块的 chunk
      this.createChunk(entryName, entryData)
    })
    // 2、根据 chunk 创建 assets
    this.createAssets()
  }

  // 根据入口文件和依赖模块组装chunks
  createChunk (entryName, entryData) {
    const chunk = {
      // 每一个入口文件作为一个 chunk
      name: entryName,
      // entry build 后的数据信息
      entryModule: entryData,
      // entry 的所依赖模块
      modules: Array.from(this.modules).filter((i) =>
        i.entryPoint.includes(entryName)
      )
    }
    // add chunk
    this.chunks.add(chunk)
  }

  createAssets () {
    const output = this.options.output
    // 根据 chunks 生成 assets
    this.chunks.forEach((chunk) => {
      const parseFileName = output.filename.replace('[name]', chunk.name)
      // 为每一个 chunk 文件代码拼接 runtime 运行时语法
      this.assets[parseFileName] = getSourceCode(chunk)
    })
  }
}

module.exports = Compilation
