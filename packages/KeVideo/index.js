/**
 *Created by limbo <yykaue@qq.com> on 2019/8/16.
 */
import KeVideo from './src/main'
// const KeVideo = () => import('./src/main')

KeVideo.install = function (Vue) {
  Vue.component(KeVideo.name, KeVideo)
}

export default KeVideo
