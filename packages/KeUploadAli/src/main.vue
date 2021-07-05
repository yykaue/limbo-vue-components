<!-- Created by limbo <yykaue@qq.com> on 2019/8/16. -->
<template>
  <div class="uploadAli">
    <el-button ref="chooseBtn" v-show="!uploadAli.chooseBtnHide" @click="chooseFiles">{{uploadAli.chooseBtnName || '选择文件'}}</el-button>
    <el-button ref="uploadBtn" type="primary" v-show="!uploadAli.uploadBtnHide">{{uploadAli.uploadBtnName || '上传'}}</el-button>
    <el-button v-if="$tools.objProxy(uploaderObj,[]).files._.length !== 0 && multiSelection"
        type="success"
        @click="resetFiles">全部清除
    </el-button>
    <slot name="uploadList" :uploaderObj="uploaderObj">
      <div v-if="$tools.objProxy(uploaderObj,[]).files._.length !== 0" class="files">
        <div v-for="(item,i) in uploaderObj.files" :key="i">
          <span class="fileName">
            {{showFileMsg(item)}}
          </span>
          <i class="iconfont icon-shanchu" @click="removeFile(item)"></i>
          <el-progress v-if="$tools.objProxy(uploadAli, true).files.progress._"
              class="progress"
              status="success"
              :text-inside="true"
              :stroke-width="14"
              :percentage="item.percent"></el-progress>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import plupload from 'plupload'
import {
  Button,
  Progress
} from 'element-ui'

export default {
  name: 'KeUploadAli',
  components: {
    'el-button': Button,
    'el-progress': Progress
  },
  props: {
    uploadAli: {
      type: Object,
      default: () => ({
        dirname: '',
        finished: true,
        autoUpload: false, // 添加文件后自动上传
        chooseBtnHide: false, // 选择文件按钮
        chooseBtnName: '选择文件', // 选择文件按钮
        uploadBtnHide: false, // 上传按钮
        uploadBtnName: '上传', // 上传按钮
        uploadedList: [],
        extraList: [ // 额外的文件数量限制规则
          // {
          //   extensions: ['dmg', 'jpg'],
          //   existed: 0,
          //   limit: 5,
          // }
        ],
        files: {
          limit: 0,
          existed: 0,
          size: 1024 * 0, // Byte
          progress: true, // 进度条
          extensions: [], // 允许上传的扩展名
          repetition: true, // 不允许重复(true 不允许)
          // img: {
          //   size: [1000, 1000], // 图片尺寸大小限制 [width, height]
          //   limit: ['=', '=']  // ['=', '!=', '<', '>', '<=', '>=']
          // }
        }
      })
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      baseConfig: {
        resourceUrl: '//cdn.abc.abc.com/',
        ossUrl: 'http://oss.aliyuncs.com/abc',
        host: 'https://abc-console.oss-cn-beijing.aliyuncs.com',
        accessid: 'accessid',
        accesskey: 'accesskey',
        policyText: {
          'expiration': '2025-01-01T12:00:00.000Z', // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
          'conditions': [
            ['content-length-range', 0, 1048576000] // 设置上传文件的大小限制
          ]
        }
      },
      uploaderObj: {},
      fileList: [],
      policyBase64: '',
      signature: ''
    }
  },
  computed: {
    // 多选
    multiSelection () {
      return this.$tools.objProxy(this.uploadAli, 2).files.limit._ !== 1
    },
    uploadConfig () {
      return {
        ...this.baseConfig,
        ...this.config
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.policyBase64 = this.$tools.Base64.encode(JSON.stringify(this.uploadConfig.policyText))
      const hash = this.$tools.CryptoJS.HmacSHA1(this.policyBase64, this.uploadConfig.accesskey)
      this.signature = hash.toString(this.$tools.CryptoJS.enc.Base64)
      this.pluploadInit()
    },
    // 显示上传文件信息
    showFileMsg (file) {
      let name = file.name
      let size = this.computeSize(file.size)
      let status = ``
      if (file.status === 5) {
        status = `（完成）`
      } else if (file.status === 4) {
        status = `（失败）`
      } else if (file.percent) {
        status = `（${file.percent}%）`
      }
      return `文件：${name} - 大小：${size}${status}`
    },
    // 文件大小
    computeSize (size) {
      let sizeStr = ``
      if (size < 1024) {
        sizeStr = `${size}B`
      } else if (size >= 1024 && size < 1024 * 1024) {
        sizeStr = `${(size / 1024).toFixed(1)}KB`
      } else if (size >= 1024 * 1024 && size < 1024 * 1024 * 1024) {
        sizeStr = `${(size / 1024 / 1024).toFixed(1)}MB`
      } else if (size >= 1024 * 1024 * 1024 && size < 1024 * 1024 * 1024 * 1024) {
        sizeStr = `${(size / 1024 / 1024 / 1024).toFixed(1)}GB`
      }
      return sizeStr
    },

    /**
     * 按钮
     */
    // 选择文件
    chooseFiles () {
      this.addFileFilterImg()
    },
    // 全部清除
    resetFiles () {
      this.uploaderObj.stop()
      this.uploadAli.finished = true
      let length = this.uploaderObj.files.length
      for (let i = length; i > 0; i--) {
        this.uploaderObj.removeFile(this.uploaderObj.files[i - 1])
      }
      this.uploadAli.uploadedList = []
      this.fileList = []
    },
    // 删除单个文件
    removeFile (file) {
      if (file.status === 2) {
        this.uploaderObj.stop()
        this.$tools.message('上传已终止', 'warning', 3000)
      }
      this.uploaderObj.removeFile(file)

      this.uploadAli.finished = true
      this.uploaderObj.files.some(item => {
        if ([1, 2].includes(item.status)) {
          this.uploadAli.finished = false
          return true
        }
      })
      this.listKillFile(file)
    },
    // 删除上传队列（fileList） 和 已上传队列（uploadedList）中的文件
    listKillFile (file) {
      this.uploadAli.uploadedList.some((item, i, arr) => {
        if (item.id === file.id) {
          arr.splice(i, 1)
          return true
        }
      })
      this.fileList.some((item, i, arr) => {
        if (item.id === file.id) {
          arr.splice(i, 1)
          return true
        }
      })
    },

    // plupload初始化
    pluploadInit () {
      this.addFileFilterImg()

      this.uploaderObj = new plupload.Uploader({
        url: this.uploadConfig.ossUrl,
        browse_button: this.$refs.chooseBtn.$el,
        multi_selection: this.multiSelection,
        filters: {
          mime_types: this.$tools.objProxy(this.uploadAli, []).files.extensions._.length
            ? [{ extensions: this.uploadAli.files.extensions.join() }]
            : undefined,
          prevent_duplicates: this.$tools.objProxy(this.uploadAli, true).files.repetition._,
          max_file_size: this.$tools.objProxy(this.uploadAli, '', []).files.size._,
          imgSize: this.$tools.objProxy(this.uploadAli, '', []).files.img.size._
        },
        runtimes: 'html5,flash,silverlight,html4',
        flashSwfUrl: 'plupload/js/Moxie.swf',
        silverlightXapUrl: 'plupload/js/Moxie.xap',
        init: {
          PostInit: this.PostInit,
          FileFiltered: this.FileFiltered,
          FilesAdded: this.FilesAdded,
          BeforeUpload: this.BeforeUpload,
          UploadComplete: this.UploadComplete,
          UploadProgress: this.UploadProgress,
          FileUploaded: this.FileUploaded,
          // StateChanged: this.StateChanged,
          Error: this.Error
        }
      })
      this.uploaderObj.init()
    },
    // 状态改变
    StateChanged (uploader) {
      console.log('uploader', uploader)
    },
    // 上传初始化动作 绑定上传按钮
    PostInit (uploader) {
      this.$refs.uploadBtn.$el.onclick = () => {
        uploader.start()
      }
    },
    // 文件选择后
    FileFiltered (uploader, file) {
      if (this.multiSelection) {
        if (this.$tools.objProxy(this.uploadAli).files.limit._ && uploader.files.length > (this.uploadAli.files.limit - (this.uploadAli.files.existed || 0))) {
          this.$tools.message(`上传文件数量不能超过${this.uploadAli.files.limit}个`, 'error', 3000)
          uploader.removeFile(file)
        } else if (this.checkExtraList(file, uploader)) {
          this.printExtraListInfo(file)
          uploader.removeFile(file)
        } else {
          this.uploadAli.finished = false
        }
      } else {
        if (uploader.files.length > 1) {
          this.listKillFile(uploader.files[0])
          uploader.removeFile(uploader.files[0])
        }
        this.uploadAli.finished = false
      }
      // 额外的自定义检查
      this.$emit('checkUploadFile', {
        uploader,
        file
      })
    },
    // 添加文件后
    FilesAdded (uploader, files) {
      if (this.uploadAli.autoUpload) {
        uploader.start()
      }
    },
    // 单个文件上传之前
    BeforeUpload (uploader, file) {
      const replaceArr = [/\+/g, /\?/g, /\%/g, /\#/g, /\//g, /\s/g]
      const inputName = typeof file.name === 'string' ? file.name : 'file'
      const reName = `${+new Date()}_${file.id}_${inputName}`
      const fileName = replaceArr.reduce((acc, cur) => acc.replace(cur, '_'), reName)
      this.fileList.push({
        fileName,
        id: file.id,
        name: file.name
      })
      const newMultipartParams = {
        'Filename': 'console/',
        'key': `${this.uploadAli.dirname || 'crm'}/${fileName}`,
        'policy': this.policyBase64,
        'OSSAccessKeyId': this.uploadConfig.accessid,
        'success_action_status': '200',
        'signature': this.signature,
        'multi_selection': false
      }
      uploader.setOption({
        'url': this.uploadConfig.host,
        'multipart_params': newMultipartParams
      })
    },
    // 整个队列中文件上传完成后
    UploadComplete (uploader, files) {
      this.uploadAli.finished = true
    },
    // 单个文件上传进度
    UploadProgress (uploader, file) {
    },
    // 单个文件上传后
    FileUploaded (uploader, file, info) {
      if (info.status === 200) {
        this.getFileUrl(file)
      }
    },
    // 错误异常处理
    Error (uploader, err) {
      switch (err.code) {
        case -200:
          this.$tools.message('网络发生错误', 'error', 3000)
          break
        case -300:
          this.$tools.message('磁盘读写错误', 'error', 3000)
          break
        case -600:
          this.$tools.message(`上传文件体积不能超过${this.computeSize(this.uploadAli.files.size)}`, 'error', 3000)
          break
        case -601:
          this.$tools.message('选择的文件类型不符合要求', 'error', 3000)
          break
        case -602:
          this.$tools.message('选取文件重复', 'error', 3000)
          break
        default:
          console.log(err)
      }
    },

    // 添加自定义 过滤类型
    addFileFilterImg () {
      if (!this.$tools.objProxy(this.uploadAli).files.img._) {
        return
      }

      plupload.addFileFilter('imgSize', (imgSize, file, cb) => {
        if (file.type.includes('image') && !file.type.includes('gif')) {
          let img = new plupload.moxie.image.Image()

          img.onload = () => {
            let flag = true
            let msg = []
            let imgMsg = [this.contrast(img.width, 0), this.contrast(img.height, 1)]
            imgMsg.forEach(item => {
              if (!item.flag) {
                flag = false
              }
              if (item.rule) {
                msg.push(`图片${item.type}需${item.rule}${item.imgSize}像素`)
              }
            })

            if (msg.length > 0) {
              this.$tools.message(`${msg.join('，')}`, 'error', 3000)
            }

            img.destroy()
            img = null
            cb(flag)
          }
          img.onerror = () => {
            console.log('imgOnError', img)
            img.destroy()
            img = null
            cb(false)
          }
          img.load(file.getSource())
        } else {
          cb(true)
        }
      })
    },
    // 对比尺寸
    contrast (size, num) {
      let flag = false
      let rule = ''
      let imgSize = this.$tools.objProxy(this.uploadAli).files.img.size[num]._
      let type = '宽'
      if (num === 1) {
        type = '高'
      }
      switch (this.$tools.objProxy(this.uploadAli).files.img.limit[num]._) {
        case '=':
          if (size === imgSize) {
            flag = true
          } else {
            rule = '等于'
          }
          break
        case '!=':
          if (size !== imgSize) {
            flag = true
          } else {
            rule = '不等于'
          }
          break
        case '>':
          if (size > imgSize) {
            flag = true
          } else {
            rule = '大于'
          }
          break
        case '<':
          if (size < imgSize) {
            flag = true
          } else {
            rule = '小于'
          }
          break
        case '>=':
          if (size >= imgSize) {
            flag = true
          } else {
            rule = '大于等于'
          }
          break
        case '<=':
          if (size <= imgSize) {
            flag = true
          } else {
            rule = '小于等于'
          }
          break
        default:
          if (size === imgSize) {
            flag = true
          } else {
            rule = '等于'
          }
      }
      return { flag, rule, type, imgSize }
    },
    // 获取扩展名
    getSuffix (fileName) {
      let pos = fileName.lastIndexOf('.')
      let suffix = ''
      if (pos !== -1) {
        suffix = fileName.substring(pos + 1)
      }
      return suffix
    },
    // 检查ExtraList文件
    checkExtraList (file, uploader) {
      let flag = false
      const suffixStr = this.getSuffix(file.name)
      const extraObj = this.$tools.objProxy(this.uploadAli, []).extraList._.find(item => item.extensions.includes(suffixStr))
      if (extraObj) {
        let count = 0
        uploader.files.forEach(item => {
          if (extraObj.extensions.includes(this.getSuffix(item.name))) {
            count++
            if (count > (extraObj.limit - (extraObj.existed || 0))) {
              flag = true
            }
          }
        })
      }
      return flag
    },
    // 对ExtraList输出message
    printExtraListInfo (file) {
      const suffixStr = this.getSuffix(file.name)
      const extraObj = this.$tools.objProxy(this.uploadAli, []).extraList._.find(item => item.extensions.includes(suffixStr)) ||  { extensions: [] }
      let msg = ''
      extraObj.extensions.forEach(item => {
        msg += item + ' '
      })
      this.$tools.message(`文件类型为${msg}的数量不能超过${extraObj.limit}个`, 'error', 4000)
    },
    // 获取file Url
    getFileUrl (file) {
      this.fileList.some(item => {
        if (item.id === file.id) {
          this.uploadAli.uploadedList.push({
            ...item,
            url: `${this.uploadConfig.resourceUrl}${this.uploadAli.dirname || 'crm'}/${item.fileName}`,
            baseUrl: `${this.uploadAli.dirname || 'crm'}/${item.fileName}`
          })
          return true
        }
      })
    }
  },
  watch: {
    'uploadAli.finished' (val, oldVal) {
      if (val) {
        this.$emit('finished', this.uploadAli.uploadedList)
      } else {
        this.$emit('unfinished', this.uploadAli.uploadedList)
      }
    },
  }
}

</script>

<style scoped lang="scss">
  @import '~limbo-common-css/lib/font-crm/iconfont.css';

  .uploadAli {
    .el-button {
      height: 20px !important;
      margin: 6px 5px;
      padding: 0 15px !important;
      line-height: 20px !important;
    }
    .files {
      padding: 10px;
      .fileName {
        word-break: break-word
      }
      .icon-shanchu {
        cursor: pointer;
        &:hover {
          color: red
        }
      }
      .progress {
        display: block;
        max-width: 600px;
        transition: width 0.5s;
      }
    }
  }
</style>
