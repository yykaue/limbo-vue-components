/**
 *Created by limbo <yykaue@qq.com> on 2019/7/3.
 */
import { printInformation } from './utils/tools'

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
  const payloadList = ['tools', 'Message', 'MessageBox']
  // limbo-common-css
  // TODO 是否需提示开发者需要注入第三方UI插件
  // const ElementUI = [
  //   'Button',
  //   'Checkbox',
  //   'CheckboxGroup',
  //   'Col',
  //   'DatePicker',
  //   'Dialog',
  //   'Form',
  //   'FormItem',
  //   'Input',
  //   'InputNumber',
  //   'Menu',
  //   'MenuItem',
  //   'Option',
  //   'Pagination',
  //   'Progress',
  //   'Table',
  //   'TableColumn',
  //   'Tooltip',
  //   'Radio',
  //   'RadioGroup',
  //   'Row',
  //   'Scrollbar',
  //   'Select',
  //   'Submenu',
  //   'Switch'
  // ]

  payloadList.forEach(item => {
    if (!options[item]) {
      const infoArray = [
        { message: 'limbo-vue-components', style: 'padding:5px;color: #fadfa3;background:#030307;border-radius:3px;' },
        { message: 'Error:', style: 'margin-left:5px;color:red;font-size:18px;font-weight:700;' },
        { message: '插件未发现' },
        { message: item, style: 'margin:0 3px;padding:3px;color:#fff;background:#F56C6C;border-radius:3px;' },
        { message: ',请注入该依赖' }
      ]
      printInformation(infoArray)
    }
  })

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
  KeUploadAli
  // KeVideo
}
export default {
  install,
  ...components
}
