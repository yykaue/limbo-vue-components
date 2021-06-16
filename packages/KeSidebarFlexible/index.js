/**
 *Created by limbo <yykaue@qq.com> on 2019/7/23.
 */
import KeSidebarFlexible from './src/main'
// const KeSidebarFlexible = () => import('./src/main')

KeSidebarFlexible.install = function (Vue) {
  Vue.component(KeSidebarFlexible.name, KeSidebarFlexible)
}

export default KeSidebarFlexible
