<!-- Created by limbo <yykaue@qq.com> on 2019/7/23. -->
<template>
  <div
    v-if="!item.hidden&&item.children"
    class="menu-wrapper"
  >
    <template v-if="hasOneShowingChild(item.children) && !onlyOneChild.children&&!item.alwaysShow">
      <a
        :href="onlyOneChild.path"
        target="_blank"
        @click="clickLink(onlyOneChild,$event)"
      >
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{'submenu-title-noDropdown':!isNest}"
        >
          <Item
            v-if="onlyOneChild.meta"
            :icon="onlyOneChild.meta.icon"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </a>
    </template>

    <el-submenu
      v-else
      :index="item.name||item.path"
    >
      <template slot="title">
        <Item
          v-if="item.meta"
          :icon="item.meta.icon"
          :title="item.meta.title"
        />
      </template>

      <template v-for="(child, i) in item.children">
        <template v-if="!child.hidden">
          <SidebarItem
            v-if="child.children&&child.children.length>0"
            :is-nest="true"
            :item="child"
            :key="child.path ? (child.path + i) : i"
            :base-path="resolvePath(child.path)"
            class="nest-menu"
          />

          <a
            v-else
            :href="child.path"
            :key="child.name ? (child.name + i) : i"
            target="_blank"
            @click="clickLink(child,$event)"
          >
            <el-menu-item :index="resolvePath(child.path)">
              <Item
                v-if="child.meta"
                :icon="child.meta.icon"
                :title="child.meta.title"
              />
            </el-menu-item>
          </a>
        </template>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import {
  MenuItem,
  Submenu
} from 'element-ui'
import Item from './Item'
import path from 'path'

export default {
  name: 'SidebarItem',
  components: {
    Item,
    'el-menu-item': MenuItem,
    'el-submenu': Submenu
  },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    hasOneShowingChild (children) {
      const showingChildren = children.filter(item => {
        let flag
        if (item.hidden) {
          flag = false
        } else {
          // temp set(will be used if only has one showing child )
          this.onlyOneChild = item
          flag = true
        }
        return flag
      })
      let flagOne = false
      if (showingChildren.length === 1) {
        flagOne = true
      }
      return flagOne
    },
    resolvePath (routePath) {
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink (routePath) {
      return this.validateURL(routePath)
    },
    // 合法URL
    validateURL (str) {
      const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
      return reg.test(str)
    },
    clickLink (route, e) {
      e.preventDefault()
      route.sidebarFn && route.sidebarFn(this)
      if (this.$tools.objProxy(route).meta.params._ && route.name) {
        this.$tools.toRouter(this, route.name, route.meta.params)
      } else if (!this.isExternalLink(route.path)) {
        const path = this.resolvePath(route.path)
        if (path === this.$route.path) return
        this.$router.push(path)
      }
    }
  }
}
</script>
