/**
 *Created by limbo <yykaue@qq.com> on 2019/7/3.
 */
import { printInformation, infoStyle, infoColor } from './utils/tools'

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

// limbo-common-css
// TODO 是否需提示开发者需要注入第三方UI插件
const componentUI = [
  'Button',
  'Checkbox',
  'CheckboxGroup',
  'Col',
  'DatePicker',
  'Dialog',
  'Form',
  'FormItem',
  'Input',
  'InputNumber',
  'Menu',
  'MenuItem',
  'Option',
  'Pagination',
  'Progress',
  'Table',
  'TableColumn',
  'Tooltip',
  'Radio',
  'RadioGroup',
  'Row',
  'Scrollbar',
  'Select',
  'Submenu',
  'Switch'
]

const install = async (Vue, options = {}) => {
  const { componentUI, libraryUI } = options
  const payloadList = ['tools', 'Message', 'MessageBox']

  payloadList.forEach(item => {
    if (!options[item]) {
      const infoArray = [
        { message: 'Error:', style: infoStyle(infoColor.danger) },
        { message: '插件未发现' },
        { message: item, style: infoStyle(infoColor.info) },
        { message: ',请注入该依赖' }
      ]
      printInformation(infoArray)
    }
  })

  if (componentUI) {
    componentUI.forEach(component => {
      Vue.component(component.name, component)
    })
  }
  if (libraryUI) {
    libraryUI.forEach(library => {
      Vue.use(library)
    })
  }

  Vue.prototype.$tools = Object.assign({},
    Vue.prototype.$tools,
    options.tools
  )
  Vue.prototype.$ElMessage = options.Message
  Vue.prototype.$ElMessageBox = options.MessageBox

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
  KeUploadAli,
  // KeVideo
  componentUI
}
export default {
  install,
  componentUI,
  ...components
}
