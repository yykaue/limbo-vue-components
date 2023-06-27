/**
 *Created by limbo <yykaue@qq.com> on 2020/7/14 10:42
 */
import {
  Message
} from 'element-ui'

const ToolsExtra = _tools => ({
  message (message, type = 'success', duration = 1500) {
    Message({ message, type, duration })
  }
})

export default ToolsExtra
