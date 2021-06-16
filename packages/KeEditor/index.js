/**
 *Created by limbo <yykaue@qq.com> on 2020/10/12.
 */
import KeEditor from './src/main'
// const KeEditor = () => import('./src/main')

KeEditor.install = function (Vue) {
  Vue.component(KeEditor.name, KeEditor)
}

export default KeEditor
