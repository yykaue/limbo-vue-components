const webpack = require('./webpack')
const config = require('./webpack.config')

const compiler = webpack(config)

// 调用run方法进行打包
compiler.run((err, stats) => {
  if (err) {
    console.log(err, 'err')
  }
  // console.log('构建完成！', stats.toJSON());
})
