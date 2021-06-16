/**
 *Created by limbo <yykaue@qq.com> on 2019/12/13.
 */
import KeAudioFix from './src/main'
// const KeAudioFix = () => import('./src/main')

KeAudioFix.install = function (Vue) {
  Vue.component(KeAudioFix.name, KeAudioFix)
}

export default KeAudioFix
