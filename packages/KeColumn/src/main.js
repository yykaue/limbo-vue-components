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
      const params = {
        props: item,
        key: item.columnkey || `${+new Date()}${i}`,
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
