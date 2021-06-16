/**
 *Created by limbo <yykaue@qq.com> on 2019/7/23.
 */
import KeFormItem from './src/main'
// const KeFormItem = () => import('./src/main')

KeFormItem.install = function (Vue) {
  Vue.component(KeFormItem.name, KeFormItem)
}

export default KeFormItem
