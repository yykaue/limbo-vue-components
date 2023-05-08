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
    }
  },
  render: (h, ctx) => {
    const Props = ctx.props

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
          // TODO 可不指定 Props下固定属性
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

    const loopDom = (_ctx, _indexKey) => {
      const {
        domIf: _domIf, // dom是否渲染 domIf: { source: 'model', keys: 'a.b' }
        dom: _dom, // dom标签
        options: _options, // options: { keys: 'option.obj', params: { 'label': 'a.b.c', 'value': 'd.e.f',} }
        attribute: _attribute = { props: {} }, // vm的支持的attribute
        props: _props = {}, // props: { aa: { source: 'model', keys: 'a.b', vModel: true } }
        on: _on, // on: { change: { emit: 'emitStr', onFn: 'fnStr', vModel: true, source: 'model', keys: 'value' } }
        children: _children
      } = _ctx
      if (_domIf && !splitDot(_domIf.keys, Props[_domIf.source])) {
        return undefined
      }

      const _domKey = _attribute.key || _indexKey
      const _domProps = getAttrsProps(_attribute, _props)
      const _domOn = getAttrsOn(_attribute, _on)

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
              ..._attribute.props,
              ..._domProps,
              ..._propsOption
            },
            on: {
              ..._attribute.on,
              ..._domOn
            },
            key: `${+new Date()}${_dom}${_i}`
          }, loopChild(_item.children)
          )
        })
      }

      return h(_dom, {
        ..._attribute,
        props: {
          ..._attribute.props,
          ..._domProps
        },
        on: {
          ..._attribute.on,
          ..._domOn
        },
        key: _domKey
      }, loopChild(_children))
    }
    const loopChild = (_ctx, _indexKey) => {
      if (!_ctx) {
        return undefined
      }
      return _ctx.map(_item => {
        if (_item.constructor !== Object) {
          return _item
        } else {
          return loopDom(_item, `${+new Date()}${_indexKey}`)
        }
      })
    }
    return Props.item.render ? loopDom(Props.item.render) : h('span', '-')
  }
}
