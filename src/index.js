/**
 *Created by limbo <yykaue@qq.com> on 2019/7/3.
 */
import ToolsExtra from './utils/ToolsExtra'

import KeAudioFix from '../packages/KeAudioFix'
import KeCheckVersion from '../packages/KeCheckVersion'
import KeColumn from '../packages/KeColumn'
import KeEditor from '../packages/KeEditor'
import KeFormItem from '../packages/KeFormItem'
import KeFormModel from '../packages/KeFormModel'

import KePaging from '../packages/KePaging'
import KeQrCode from '../packages/KeQrCode'
import KeSidebar from '../packages/KeSidebar'
import KeSidebarFlexible from '../packages/KeSidebarFlexible'
import KeTable from '../packages/KeTable'
import KeToBack from '../packages/KeToBack'
import KeUnfinished from '../packages/KeUnfinished'
import KeUploadAli from '../packages/KeUploadAli'
// import KeVideo from '../packages/KeVideo'

const components = {
  KeAudioFix,
  KeCheckVersion,
  KeColumn,
  KeEditor,
  KeFormItem,
  KeFormModel,
  KePaging,
  KeQrCode,
  KeSidebar,
  KeSidebarFlexible,
  KeTable,
  KeToBack,
  KeUnfinished,
  KeUploadAli
  // KeVideo
}

const install = (Vue, options = {}) => {
  if (!options.tools) {
    console.log('vue-component插件对tools有依赖，请加载')
  }
  Vue.prototype.$tools = Object.assign({},
    Vue.prototype.$tools,
    options.tools,
    ToolsExtra(options.tools)
  )
  Object.keys(components).forEach(item => {
    Vue.component(components[item].name, components[item])
  })
}

export {
  KeAudioFix,
  KeCheckVersion,
  KeColumn,
  KeEditor,
  KeFormItem,
  KeFormModel,
  KePaging,
  KeQrCode,
  KeSidebar,
  KeSidebarFlexible,
  KeTable,
  KeToBack,
  KeUnfinished,
  KeUploadAli
  // KeVideo
}
export default {
  install,
  KeAudioFix,
  KeCheckVersion,
  KeColumn,
  KeEditor,
  KeFormItem,
  KeFormModel,
  KePaging,
  KeQrCode,
  KeSidebar,
  KeSidebarFlexible,
  KeTable,
  KeToBack,
  KeUnfinished,
  KeUploadAli
}
