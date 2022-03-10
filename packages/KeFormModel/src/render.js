/**
 *Created by limbo <yykaue@qq.com> on 2022/3/10.
 */
export default {
  name: 'RenderItem',
  functional: true,
  props: {
    model: {
      type: Object,
      default: () => ({})
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  render: (h, ctx) => {
    const {
      model: Model,
      item: Item
    } = ctx.props
    if (Item.render) {
      return Item.render(h, Model)
    } else {
      return h('span', Model[Item.key] ?? '-')
    }
  }
}
  