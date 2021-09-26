/**
 *Created by limbo <yykaue@qq.com> on 2019/7/23.
 */
import KeFormModel from './src/main'
// const KeFormModel = () => import('./src/main')

KeFormModel.install = function (Vue) {
  Vue.component(KeFormModel.name, KeFormModel)
}

export default KeFormModel
