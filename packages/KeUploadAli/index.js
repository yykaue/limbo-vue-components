/**
 *Created by limbo <yykaue@qq.com> on 2019/8/16.
 */
import KeUploadAli from './src/main'
// const KeUploadAli = () => import('./src/main')

KeUploadAli.install = function (Vue) {
  Vue.component(KeUploadAli.name, KeUploadAli)
}

export default KeUploadAli
