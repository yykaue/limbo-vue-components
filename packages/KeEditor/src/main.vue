<!-- Created by limbo <yykaue@qq.com> on 2020/10/12. -->
<template>
  <div
    class="content"
    ref="editor"
  />
</template>

<script>
import Wangeditor from 'wangeditor'

export default {
  name: 'KeEditor',
  props: {
    config: {
      type: Object,
      default: () => ({
        action: '/counselor-assistant/image/upload',
        name: 'files',
        data: {
          purpose: 'temp'
        }
      })
    },
    toolbar: {
      type: Array,
      default: () => [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'image', // 插入图片
        // 'table',  // 表格
        'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ]
    },
    colors: {
      type: Array,
      default: () => ['#000000', '#eeece0', '#0000ff', '#4d80bf', '#ff0000', '#8baa4a', '#7b5ba1', '#46acc8', '#f9963b', '#ffffff']
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editor: null,
      currentValue: this.value
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.editor = new Wangeditor(this.$refs.editor)
      this.setEditorConfig()
      this.setEditorEvent()
      this.editor.create()
    },
    setEditorConfig () {
      this.editor.customConfig.uploadImgServer = this.config.action
      this.editor.customConfig.uploadFileName = this.config.name || 'files'
      this.editor.customConfig.uploadImgTimeout = this.config.timeout || 60000
      this.editor.customConfig.uploadImgParams = this.config.data || { purpose: 'temp' }
      this.editor.customConfig.colors = this.colors
      this.editor.customConfig.menus = this.toolbar
    },
    setEditorEvent () {
      this.editor.customConfig.onchange = (html) => {
        this.currentValue = html
      }
      this.editor.customConfig.uploadImgHooks = {
        success: function (xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果】
        },
        fail: function (xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function (xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        customInsert: function (insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          // editor 是编辑器对象
          if (!result.data) return
          result.data.forEach((item) => {
            insertImg(item.url)
          })
        }
      }
    },
    setContent (_content) {
      this.editor.txt.html(_content)
      this.currentValue = _content
    },
    getContent () {
      return this.currentValue
    }
  },
  watch: {
    'value' (val) {
      if (this.currentValue !== val) {
        this.currentValue = val
        this.editor.txt.html(val)
      }
    },
    'currentValue' (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('change', newVal)
        this.$emit('input', newVal)
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
