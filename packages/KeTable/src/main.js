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
  props: {
    cols: {
      type: Array,
      default: () => ([])
    },
    data: {
      type: Array,
      default: () => ([])
    },
    props: {
      type: Object,
      default: () => ({})
    },
    params: {
      type: Object,
      default: () => ({})
    }
  },
  render: (h, ctx) => {
    const {
      cols: Cols = [],
      data: Data = [],
      props: Props = {},
      params: Params = {}
    } = ctx.props

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
