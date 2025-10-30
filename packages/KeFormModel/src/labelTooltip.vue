<!-- Created by limbo <yykaue@qq.com> on 2025/9/5. -->
<template>
  <el-tooltip
    slot="label"
    effect="light"
    :content="typeof item.name === 'function' ? item.name() : item.name"
    :disabled="disabled"
    :open-delay="500"
    placement="top"
  >
    <p class="label-layout">
      <span ref="label">{{ typeof item.name === 'function' ? item.name() : item.name }}</span>
    </p>
  </el-tooltip>
</template>

<script>
export default {
  name: 'LabelTooltip',
  components: { },
  props: {
    item: {
      type: Object,
      default: () => ({
        name: ''
      })
    }
  },
  data () {
    return {
      disabled: false
    }
  },
  computed: {
  },
  mounted () {
    this.showTooltip()
  },
  methods: {
    showTooltip () {
      this.disabled = this.$refs.label.offsetWidth <= this.$refs.label.parentNode.offsetWidth
    }
  }
}

</script>

<style scoped lang="scss">
.label-layout {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
