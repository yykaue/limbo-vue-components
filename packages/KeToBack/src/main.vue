<!-- Created by limbo <yykaue@qq.com> on 2019/7/18. -->
<template>
  <i
    @click="back"
    title="返回"
    class="iconfont icon-fanhui icon-back"
  />
</template>

<script>
export default {
  name: 'KeToBack',
  components: {},
  data () {
    return {}
  },
  mounted () {},
  methods: {
    back () {
      this.$router.back()
    }
  }
}

</script>

<style scoped lang="scss">
  .icon-back {
    float: left;
    margin-right: 15px;
    font-size: 32px;
    cursor: pointer;
    &:hover {
      color: #ccc;
    }
  }
</style>
