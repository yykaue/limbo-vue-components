<!-- Created by limbo <yykaue@qq.com> on 2020/10/12. -->
<template>
  <span />
</template>

<script>
import {
  MessageBox
} from 'element-ui'
import versionCheck from './versionCheck'

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
    findNewVersion (payload) {
      if (this.onEmit) {
        this.$emit('findVersion', payload)
        return
      }
      clearInterval(payload.times)
      MessageBox.alert('请点击 <确定> 更新系统，如不更新可能造成数据错误，请知悉', '发现新版本', {
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
    }
  }
}
</script>
