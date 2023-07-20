<!-- Created by limbo <yykaue@qq.com> on 2019/7/18. -->
<template>
  <el-pagination
    class="paging"
    v-bind="$attrs"
    v-on="$listeners"
    :current-page.sync="params.current"
    :page-size.sync="params.pageSize"
    :page-sizes="pageSizes"
    :layout="layout"
    @size-change="onSizeChange"
    @current-change="onCurrentChange"
  >
    <slot />
  </el-pagination>
</template>

<script>
export default {
  name: 'KePaging',
  inheritAttrs: false,
  components: {},
  props: {
    params: {
      type: Object,
      default: () => ({
        current: 1,
        pageSize: 10
      })
    },
    pageSizes: {
      type: Array,
      default: () => ([10, 25, 50])
    },
    layout: {
      type: String,
      default: '->, total, sizes, prev, pager, next, jumper'
    }
  },
  methods: {
    // size改变
    onSizeChange (val) {
      this.params.current = 1
      this.onCurrentChange()
    },
    // currentPage改变
    onCurrentChange (val) {
      this.$emit('currentPage', val)
    }
  }
}

</script>
