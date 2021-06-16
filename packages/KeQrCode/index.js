/**
 *Created by limbo <yykaue@qq.com> on 2019/7/18.
 */
import KeQrCode from './src/main'
// const KeQrCode = () => import('./src/main')

KeQrCode.install = function (Vue) {
  Vue.component(KeQrCode.name, KeQrCode)
}

export default KeQrCode
