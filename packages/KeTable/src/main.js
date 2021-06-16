/**
 *Created by limbo <yykaue@qq.com> on 2019/7/11.
 */
import {
  Table,
  TableColumn
} from 'element-ui'

export default {
  name: 'KeTable',
  functional: true,
  components: {
    ElTable: Table,
    ElTableColumn: TableColumn
  },
  render: (h, ctx) => {
    const {
      data: Data = [],
      params: Params = {},
      props: Props = {},
      cols: Cols = []
    } = ctx.props.tables

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

    return h(
      'el-table',
      {
        props: {
          ...Props,
          data: Data
        },
        ...Params
      },
      loopCols(Cols)
    )
  }
}
