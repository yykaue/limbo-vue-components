/**
 *Created by limbo <yykaue@qq.com> on 2019/7/11.
 */
import KeTable from './src/main'
// const KeTable = () => import('./src/main')

KeTable.install = function (Vue) {
  Vue.component(KeTable.name, KeTable)
}

export default KeTable
