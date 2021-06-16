/**
 *Created by limbo <yykaue@qq.com> on 2019/7/23.
 */
import KeSidebar from './src/main'
// const KeSidebar = () => import('./src/main')

KeSidebar.install = function (Vue) {
  Vue.component(KeSidebar.name, KeSidebar)
}

export default KeSidebar
