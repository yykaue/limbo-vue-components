<!-- Created by limbo <yykaue@qq.com> on 2019/12/13. -->
<template>
  <el-dialog
      title="修复录音"
      :before-close="cancel"
      :visible.sync="audioParams.visible"
      :append-to-body="appendToBody"
      width="420px">
    <div>
      <span>采集频率：</span>
      <el-input-number
          class="config-number"
          v-model="config.sampleRate"
          placeholder="采集频率"
          :min="1"
          :max="100000000000"
          :precision="0"
          :controls="false"></el-input-number>
      <span class="ml10">采集位数：</span>
      <el-input-number
          class="config-number"
          v-model="config.sampleBits"
          placeholder="采集位数"
          :min="1"
          :max="100000000000"
          :precision="0"
          :controls="false"></el-input-number>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  Button,
  Dialog,
  InputNumber,
} from 'element-ui'
export default {
  name: 'dialogFix',
  components: {
    'el-button': Button,
    'el-dialog': Dialog,
    'el-input-number': InputNumber,
  },
  props: {
    audioParams: {
      type: Object,
      default: () => ({
        visible: false
      })
    },
    appendToBody: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      config: {
        sampleRate: new (window.webkitAudioContext || window.AudioContext)().sampleRate || 44100,
        sampleBits: 16
      }
    }
  },
  methods: {
    cancel () {
      this.audioParams.visible = false
    },
    save () {
      this.$emit('audioFix', this.config)
      this.cancel()
    }
  }
}
</script>

<style scoped lang="scss">
  .config-number {
    width: 90px;
  }
</style>
