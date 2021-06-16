/**
 *Created by limbo <yykaue@qq.com> on 2020/10/12 15:23
 */
/**
 * 上传静态资源到OSS
 */
// "ali-oss": "6.11.2"
const OSS = require('ali-oss')
const path = require('path')
const fs = require('fs')

const baseUrl = process.argv[2] ? `/${process.argv[2]}` : ''
const uploadUrl = process.argv[3] ? `/${process.argv[3]}` : baseUrl

// 获取版本
const files = fs.readdirSync(`dist${baseUrl}/js/`)
let version = ''
files.some(item => {
  if (item.includes('app')) {
    version = item
    return true
  }
})

// 静态资源根目录(注意文件位置！)
const rootAssets = path.resolve(__dirname, `./dist${baseUrl}`)

// 上传设置
// 地址 //abc-console.oss-cn-beijing.aliyuncs.com 或 //cdn.abc.abc.com
const client = new OSS({
  accessKeyId: 'accessKeyId',
  accessKeySecret: 'accessKeySecret',
  region: 'oss-cn-beijing', // OSS 服务节点, 示例: oss-cn-hangzhou
  bucket: 'abc-console' // OSS 存储空间
})

async function uploadFiles (fileName) {
  const headers = {
    'Cache-Control': 'no-store',
    expires: -1
  }
  const filePath = path.resolve(rootAssets, fileName)
  const uploadPath = `/version${uploadUrl}/${fileName}`

  try {
    await client.put(
      uploadPath,
      filePath,
      headers
    )
    console.log('CDN上的版本已更新！')
    console.log(`版本:${version},地址://abc-console.oss-cn-beijing.aliyuncs.com${uploadPath}`)
  } catch (e) {
    console.error(e)
  }
}

// 写入文件
fs.writeFile(`dist${baseUrl}/version.txt`, version, err => {
  if (err) {
    return console.error(err)
  }
  console.log('版本写入成功！')
  uploadFiles('version.txt')
})
