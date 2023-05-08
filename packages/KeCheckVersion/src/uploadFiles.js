/**
 *Created by limbo <yykaue@qq.com> on 2020/10/30.
 */
/**
 * 上传静态资源到OSS
 */
// "ali-oss": "6.11.2"
const OSS = require('ali-oss')
const path = require('path')
const fs = require('fs')

// 上传文件夹名 不要与其他目录同名！
const uploadDir = '_uploadDir'
// 静态资源根目录(注意文件位置！)
const rootAssets = path.resolve(__dirname, `./${uploadDir}`)

// 上传设置
// 地址 //abc-console.oss-cn-beijing.aliyuncs.com 或 //abc.abc.com'
const client = new OSS({
  accessKeyId: 'accessKeyId',
  accessKeySecret: 'accessKeySecret',
  region: 'oss-cn-beijing', // OSS 服务节点, 示例: oss-cn-hangzhou
  bucket: 'abc-console' // OSS 存储空间
})

async function uploadFile (filePath) {
  // const headers = {
  //   'Cache-Control': 'no-store',
  //   expires: -1
  // }
  const uploadPath = `/fonts/${filePath.split(`\\${uploadDir}\\`)[1]}`
  try {
    await client.put(
      uploadPath,
      filePath
      // headers
    )
    console.log(`//abc-console.oss-cn-beijing.aliyuncs.com${uploadPath}`)
  } catch (e) {
    console.error(e)
  }
}

function LoopDirectory (dir) {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.resolve(dir, file)
    if (fs.lstatSync(filePath).isDirectory()) {
      LoopDirectory(filePath)
    } else {
      uploadFile(filePath)
    }
  })
}

LoopDirectory(rootAssets)
