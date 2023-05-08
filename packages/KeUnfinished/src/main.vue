<!-- Created by limbo <yykaue@qq.com> on 2019/7/18. -->
<template>
  <div class="shadow">
    <div class="inner">
      敬请期待
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeUnfinished',
  data () {
    return {}
  },
  mounted () {},
  methods: {}
}

</script>

<style scoped lang="scss">
  .shadow {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .4);
    .inner {
      position: fixed;
      left: 0;
      right: -180px;
      top: 0;
      bottom: 0;
      margin: auto;
      padding: 0 30px;
      width: 100px;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      text-align: center;
      background-color: #fff;
      border-radius: 5px;
    }
  }
</style>
