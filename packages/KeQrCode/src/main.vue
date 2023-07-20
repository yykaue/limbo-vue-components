<!-- Created by limbo <yykaue@qq.com> on 2019/7/18. -->
<template>
  <canvas ref="qrCode" />
</template>

<script>
import qrCode from 'qrcode'

export default {
  name: 'KeQrCode',
  props: {
    // 需要生成二维码的内容
    data: {
      type: String,
      default: 'test'
    },
    option: {
      type: Object,
      default: () => ({
        width: 200,
        height: 200,
        margin: 0,
        color: {
          dark: '#409EFF',
          light: '#fff'
        }
      })
    }
  },
  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.createQr()
    },
    createQr () {
      qrCode.toDataURL(
        this.$refs.qrCode,
        this.data,
        this.option,
        error => {
          if (error) {
            this.$ElMessage({
              message: '二维码生成失败，请稍后重试',
              type: 'error',
              duration: 2000
            })
            console.error(error)
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
