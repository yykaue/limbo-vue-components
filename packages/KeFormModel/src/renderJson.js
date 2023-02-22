/**
 *Created by limbo <yykaue@qq.com> on 2023/2/21.
 */
export default {
  name: 'RenderJson',
  functional: true,
  props: {
    vue: {
      type: Object,
      default: () => ({})
    },
    model: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    },
    item: {
      type: Object,
      default: () => ({})
    },
    // TODO
    props: {
      type: Object,
      default: () => ({})
    },
  },
  render: (h, ctx) => {
    const Props = ctx.props
    const {
      dom: topDom, // dom标签
      options: topOptions, // options: { keys: 'option.obj', params: { 'label': 'a.b.c', 'value': 'd.e.f',} }
      attribute: topAttribute = { props: {} }, // vm的支持的attribute
      props: topProps = {}, // props: { aa: { source: 'model', keys: 'a.b', vModel: true } }
      on: topOn, // on: { change: { emit: 'emit', onFn: 'fn', vModel: true, source: 'model', keys: 'value' } }
      children: topChildren = []
    } = Props.item.render || {}

    const splitDot = (keyStr, paramsObj) => keyStr.split('.').reduce((pre, cur) => pre[cur], paramsObj)
    // 内部props
    const getAttrsProps = (_attribute, _props) => {
      const _propsParams = {}
      for (const key in _props) {
        const keyItem = _props[key]

        if (keyItem.constructor !== Object) {
          _propsParams[key] = keyItem
        } else {
          const sourceObj = Props[keyItem.source]
          if (keyItem.vModel) {
            _propsParams[key] = sourceObj[Props.item.key]
          } else {
            _propsParams[key] = splitDot(keyItem.keys, sourceObj)
          }
        }
      }
      return _propsParams
    }
    // 内部on
    const getAttrsOn = (_attribute, _on) => {
      const _onParams = {}
      for (const key in _on) {
        const keyItem = _on[key]
        _onParams[key] = (...arg) => {
          Props.vue[keyItem.onFn]({
            type: keyItem.emit,
            payload: arg
          })
          if (keyItem.vModel) {
            const sourceObj = Props[keyItem.source]
            const keyList = keyItem.keys.split('.')
            const lastItem = keyList.reduce((pre, cur, curIndex, arr) => {
              if (curIndex === arr.length - 1) {
                return pre
              } else {
                return pre[cur]
              }
            }, sourceObj)

            lastItem[keyList[keyList.length - 1]] = arg[0]
          }
        }
      }
      return _onParams
    }

    const loopDom = domList => domList.map((_ctx, _index) => {
      const {
        dom: _dom, // dom标签
        options: _options, // options: { keys: 'option.obj', params: { 'label': 'a.b.c', 'value': 'd.e.f',} }
        attribute: _attribute = { props: {} }, // vm的支持的attribute
        props: _props = {}, // props: { aa: { source: 'model', keys: 'a.b', vModel: true } }
        on: _on, // on: { change: { emit: 'emit', onFn: 'fn', vModel: true, source: 'model', keys: 'value' } }
        children: _children
      } = _ctx
      // 内部key
      _attribute.key = _attribute.key || `${+new Date()}${_dom}${_index}`

      const _domProps = getAttrsProps(_attribute, _props)
      const _domOn = getAttrsProps(_attribute, _props)
      getAttrsOn(_attribute, _on)

      // options迭代
      if (_options) {
        return splitDot(_options.keys, Props.options).map((_item, _i) => {
          const _propsOption = {}
          for (const key in _options.params) {
            _propsOption[key] = splitDot(_options.params[key], _item)
          }
          return h(_dom, {
              ..._attribute,
              props: {
                ...topAttribute.props,
                ..._domProps,
                ..._propsOption
              },
              on: {
                ...topAttribute.on,
                ..._domOn
              },
              key: `${+new Date()}${_dom}${_index}${_i}`
            }, _item.children ? loopDom(_item.children) : undefined
          )
        })
      }
      // children迭代
      return h(_dom, {
          ..._attribute,
          props: {
            ...topAttribute.props,
            ..._domProps
          },
          on: {
            ...topAttribute.on,
            ..._domOn
          },
        }, _children ? loopDom(_children) : undefined)
    })

    const domProps = getAttrsProps(getAttrsProps, topProps)
    const domOn = getAttrsOn(topAttribute, topOn)
    return Props.item.render ? h(topDom, {
      ...topAttribute,
      props: {
        ...topAttribute.props,
        ...domProps
      },
      on: {
        ...topAttribute.on,
        ...domOn
      }
    }, loopDom(topChildren)) : h('span', '-')
  }
}
