/**
 *Created by limbo <yykaue@qq.com> on 2019/7/18.
 */
import KePaging from './src/main'
// const KePaging = () => import('./src/main')

KePaging.install = function (Vue) {
  Vue.component(KePaging.name, KePaging)
}

export default KePaging
