<!-- Created by limbo <yykaue@qq.com> on 2019/12/13. -->
<template>
  <div class="audio-fix">
    <el-tooltip class="tooltip-icon" placement="top">
      <div slot="content">手动修复录音失真</div>
      <i class="iconfont icon-xiufu" @click="openFix"></i>
    </el-tooltip>
    <DialogFix :audioParams="audioParams" :appendToBody="appendToBody" @audioFix="audioFix" />
  </div>

</template>

<script>
import {
  Tooltip
} from 'element-ui'
import DialogFix from './modules/dialogFix'
export default {
  name: 'KeAudioFix',
  components: {
    'el-tooltip': Tooltip,
    DialogFix
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      audioParams: {
        visible: false
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {},
    openFix () {
      this.audioParams.visible = true
    },
    audioFix (payload) {
      this.$emit('audioFix', payload)
    }
  }
}

</script>

<style scoped lang="scss">
  .audio-fix {
    display: inline-block;
  }
  .tooltip-icon {
    font-size: 24px;
    cursor: pointer;
  }
</style>
