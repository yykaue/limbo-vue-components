/**
 *Created by limbo <yykaue@qq.com> on 2019/7/18.
 */
import KeToBack from './src/main'
// const KeToBack = () => import('./src/main')

KeToBack.install = function (Vue) {
  Vue.component(KeToBack.name, KeToBack)
}

export default KeToBack
