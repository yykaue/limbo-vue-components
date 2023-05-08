<!-- Created by limbo <yykaue@qq.com> on 2019/7/18. -->
<template>
  <!--  <div @contextmenu="()=> defaultMenu(false)">-->
  <video
    ref="vdo"
    class="video-js"
    controls
    preload="auto"
    width="640"
    height="264"
    poster=""
    data-setup="{}"
  >
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a web browser that
      <a
        href="https://videojs.com/html5-video-support/"
        target="_blank"
      >supports HTML5 video</a>
    </p>
  </video>
</template>

<script>
import videoJs from 'video.js'
export default {
  name: 'KeVideo',
  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    controlBar: {
      type: Object,
      default: undefined
    },
    onPlayerReadyFn: {
      type: Function,
      default: undefined
    }
  },
  data () {
    return {
      videoPlayer: {},
      videoOption: {
        controls: true, // 是否显示控制条
        poster: 'xxx', // 视频封面图地址
        preload: 'auto',
        autoplay: false,
        fluid: true, // 自适应宽高
        language: 'zh-CN', // 设置语言
        muted: false, // 是否静音
        inactivityTimeout: false,
        controlBar: { // 设置控制条组件
          /* 设置控制条里面组件的相关属性及显示与否
          'currentTimeDisplay':true,
          'timeDivider':true,
          'durationDisplay':true,
          'remainingTimeDisplay':false,
          volumePanel: {
            inline: false,
          }
          */
          /* 使用children的形式可以控制每一个控件的位置，以及显示与否 */
          children: [
            { name: 'playToggle' }, // 播放按钮
            { name: 'currentTimeDisplay' }, // 当前已播放时间
            { name: 'progressControl' }, // 播放进度条
            { name: 'durationDisplay' }, // 总时间
            { // 倍数播放
              name: 'playbackRateMenuButton',
              playbackRates: [1, 1.25, 1.5, 2]
            },
            {
              name: 'volumePanel', // 音量控制
              inline: false // 不使用水平方式
            },
            { name: 'FullscreenToggle' } // 全屏
          ]
        },
        sources: [ // 视频源
          {
            src: '//vjs.zencdn.net/v/oceans.mp4',
            type: 'video/mp4',
            poster: '//vjs.zencdn.net/v/oceans.png'
          }
        ]
      }
    }
  },
  computed: {
    videoOptionMerge () {
      const option = {
        ...this.videoOption,
        ...this.option
      }
      if (this.controlBar) {
        option.controlBar = this.controlBar
      }
      return option
    }
  },
  mounted () {
    this.videoInit()
  },
  destroyed () {
    // this.defaultMenu()
  },
  methods: {
    videoInit () {
      this.videoPlayer = videoJs(this.$refs.vdo, this.videoOptionMerge, this.onPlayerReadyFn || this.onPlayerReady)
    },
    onPlayerReady () {
      this.$emit('playerReady', this.videoPlayer)
      this.videoPlayer.on('ended', () => {
        this.$emit('ended', this.videoPlayer)
      })
    },
    cutoverSrc (data, posterImage) {
      this.videoPlayer.src(data)
      this.videoPlayer.load(data)
      posterImage && this.posterImage.setSrc(posterImage)
    },
    defaultMenu (flag = true) {
      window.oncontextmenu = () => flag
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~video.js/dist/video-js.css"
</style>
