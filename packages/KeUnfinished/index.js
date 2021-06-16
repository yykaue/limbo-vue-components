/**
 *Created by limbo <yykaue@qq.com> on 2019/7/18.
 */
import KeUnfinished from './src/main'
// const KeUnfinished = () => import('./src/main')

KeUnfinished.install = function(Vue) {
  Vue.component(KeUnfinished.name, KeUnfinished)
};

export default KeUnfinished
