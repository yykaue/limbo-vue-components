/**
 *Created by limbo <yykaue@qq.com> on 2019/7/18.
 */
import KeColumn from './src/main'
// const KeColumn = () => import('./src/main')

KeColumn.install = function (Vue) {
  Vue.component(KeColumn.name, KeColumn)
}

export default KeColumn
