<!-- Created by limbo <yykaue@qq.com> on 2019/7/18. -->
<template>
  <el-pagination
      class="paging"
      @size-change="sizeChange"
      @current-change="currentChange"
      @prev-click="prevClick"
      @next-click="nextClick"
      :current-page.sync="paging.params.current"
      :page-sizes="paging.pageSizes || pageSizes"
      :page-size="paging.params.pageSize"
      :layout="paging.layout || layout"
      :total="paging.total">
  </el-pagination>
</template>

<script>
import {
  Pagination
} from 'element-ui'
export default {
  name: 'KePaging',
  components: {
    'el-pagination': Pagination
  },
  // inheritAttrs: false,
  props: {
    paging: {
      type: Object,
      default: () => ({
        params: {
          current: 1,
          pageSize: 10
        },
        pageSizes: [10, 25, 50],
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0
      })
    }
  },
  data () {
    return {
      pageSizes: [10, 25, 50],
      layout: 'total, sizes, prev, pager, next, jumper'
    }
  },
  mounted () {},
  methods: {
    // size改变
    sizeChange (val) {
      this.paging.params.pageSize = val
      this.paging.params.current = 1
      this.currentChange(val)
    },
    // currentPage改变
    currentChange (val) {
      this.$emit('propsFn', {
        type: 'currentPage',
        data: null
      })
    },
    // prevClick click
    prevClick (val) {
      // console.log('prev',val)
    },
    // nextClick click
    nextClick (val) {
      // console.log('next',val)
    }
  }
}

</script>

<style scoped lang="scss">
  .paging {
    text-align: right;
    margin-top: 10px;
    /deep/ .el-input__inner {
      height: 28px !important;
    }
  }
</style>
