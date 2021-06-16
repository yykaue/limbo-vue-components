/**
 *Created by limbo <yykaue@qq.com> on 2019/7/18.
 */
import KeCheckVersion from './src/main'
// const KeCheckVersion = () => import('./src/main')

KeCheckVersion.install = function(Vue) {
  Vue.component(KeCheckVersion.name, KeCheckVersion)
};

export default KeCheckVersion
