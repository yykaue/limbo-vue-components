<!-- Created by limbo <yykaue@qq.com> on 2020/10/12. -->
<template></template>
<script>
/**
 *Created by limbo <yykaue@qq.com> on 2020/10/18.
 */
import {
  MessageBox
} from 'element-ui'
import versionCheck from "./versionCheck"

export default {
  name: 'KeCheckVersion',
  props: {
    url: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    license: {
      type: Boolean,
      default: process.env.NODE_ENV !== 'development'
    },
    timeout: {
      type: Number,
      default: 30 * 1000
    },
    onEmit: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // const path = this.path || `/${process.env.BASE_URL.replace(/\//g, '')}${this.$tools.getEnv().replace(/\./g, '')}`
      const path = this.path || `/${location.pathname.split('/')[1]}`
      versionCheck({
        cb: this.findNewVersion,
        timeout: this.timeout,
        license: this.license,
        url: this.url,
        path: path
      })
    },
    findNewVersion (params) {
      if (this.onEmit) {
        this.$emit('findVersion', params)
        return
      }
      clearInterval(params.times)
      MessageBox.alert(`<p>请点击 <span class="red">确定</span> 更新系统，如不更新可能造成数据错误，请知悉</p>`, {
        title: '发现新版本',
        dangerouslyUseHTMLString: true,
        lockScroll: false,
        confirmButtonText: '确定',
        callback: action => {
          if (action === 'confirm') {
            location.reload()
          } else {
            this.init()
          }
        }
      })
    },
  }
}

</script>
