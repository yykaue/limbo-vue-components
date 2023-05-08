/**
 *Created by limbo <yykaue@qq.com> on 2022/3/10.
 */
export default {
  name: 'RenderItem',
  functional: true,
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  render: (h, ctx) => {
    const { item: Item } = ctx.props
    return Item.render(h, Item)
  }
}
