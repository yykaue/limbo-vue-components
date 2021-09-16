/**
 *Created by limbo <yykaue@qq.com> on 2019/7/18.
 */
import {
  TableColumn
} from 'element-ui'

export default {
  name: 'KeColumn',
  functional: true,
  components: {
    ElTableColumn: TableColumn
  },
  render: (h, ctx) => {
    const Cols = ctx.props.cols || []

    const loopCols = data => data.map((item, i) => {
      let key
      if (item.columnKey === false) {
        key = `${+new Date()}${i}`
      } else {
        key = item.columnKey || item.prop || `${+new Date()}${i}`
      }
      const params = {
        props: item,
        key,
        scopedSlots: {
          default: item.render ? props => item.render(h, props) : undefined,
          header: item.header ? props => item.header(h, props) : undefined
        }
      }
      if (item.children) {
        return h('el-table-column', params, loopCols(item.children))
      }
      return h('el-table-column', params)
    })

    return loopCols(Cols)
  }
}
