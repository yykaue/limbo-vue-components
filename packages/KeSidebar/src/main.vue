<!-- Created by limbo <yykaue@qq.com> on 2019/7/23. -->
<template>
  <div class="layout-sidebar">
    <el-scrollbar
      class="scrollbar-wrapper"
      wrap-class="scrollbar-wrapper"
    >
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <slot name="logo" />
        <slot name="title" />
        <SidebarItem
          v-for="(route, i) in permission_routers"
          :key="route.name ? (route.name + i) : i"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <KeSidebarFlexible
      v-if="flexible"
      class="hamburger-container"
      :is-active="isActive"
      @toggleClick="toggleClick"
    />
  </div>
</template>

<script>
import {
  Menu,
  Scrollbar
} from 'element-ui'
import SidebarItem from './SidebarItem'
import KeSidebarFlexible from '../../KeSidebarFlexible'

export default {
  name: 'KeSidebar',
  components: {
    SidebarItem,
    KeSidebarFlexible,
    'el-menu': Menu,
    'el-scrollbar': Scrollbar
  },
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    permission_routers: {
      type: Array,
      default: () => ([])
    },
    sidebar: {
      type: Object,
      default: () => ({
        open: true,
        withoutAnimation: false
      })
    },
    flexible: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  methods: {
    toggleClick () {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped lang="scss">
  .layout-sidebar {
    position: relative;
  }

  ::v-deep .scrollbar-wrapper {
    height: 100%;
    overflow-x: hidden !important;
    .el-scrollbar__view {
      height: 100%;
    }
  }

  .hamburger-container {
    position: absolute;
    top: 10px;
    right: -20px;
    height: 20px;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .img-logo {
    width: 130px;
    margin: 10px 0 0 3px;
  }
</style>
