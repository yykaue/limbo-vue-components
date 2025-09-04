## limbo-vue-components

通用组件库

## 安装方法

    npm i limbo-vue-components

## 使用说明

##### 全局引入

    import Packages from 'limbo-vue-components'
    Vue.use(Packages)

##### 局部引入

    import { xxx } from 'limbo-vue-components'
    Vue.use(xxx)

##### 组件

###### KeTable

      <KeTable
      :data="tableData"
      />

      tableData: {
        props: {
          // 附加在el-table上的属性，一般可省略
        },
        params: {
          on: {
              'cell-click': (row) => console.log('row', row),
          },
          ref: 'myTable'
        },
        data: [
          { a: 1, b: ['CL', 'AB'], c: '珂爸爸1', d: { game: 'Limbo' } },
          { a: 2, b: ['GL', 'AB'], c: '珂爸爸2', d: { game: 'Dark Souls' } }
        ],
        cols: [
          {
            label: '顶级表头',
            children: [
              {
                label: 'C2-1',
                prop: 'a',
                header: (h, ctx) => (
                  <el-input
                    {...{ on: { change: () => console.log('input') } }}
                  />
                ),
                children: [
                  {
                    type: 'selection'
                  },
                  {
                    label: 'C3-1',
                    prop: 'a'
                  },
                  {
                    label: 'C3-2',
                    prop: 'c',
                    children: [
                      {
                        label: 'C4-0',
                        prop: 'c',
                        render: (h, ctx) => (
                          <div>
                            <p style="color: red">{ctx.row.a}</p>
                            <p>{ctx.row.d.game}</p>
                          </div>
                        )
                      },
                    ]
                  }
                ]
              },
              {
                label: 'C',
                prop: 'c',
                header: (h, ctx) => h(
                  'div',
                  {
                    on: {
                      click: () => console.log(ctx)
                    }
                  },
                  Title
                ),
                render: (h, _ctx) => (
                  <div>
                    <p style="color: red">{_ctx.row.c}</p>
                    <p>{_ctx.row.d.game}</p>
                  </div>
                )
              }
            ]
          },
          {
            label: 'Game',
            render: (h, ctx) => h(
              'div',
              {},
              [
                h('span', {}, ctx.row.b[0] + '，'),
                h('i', {}, ctx.row.a)
              ]
            )
          },
          {
            label: 'Name',
            render: (h, ctx) => (
              <div>
                <p style="color: red">{ctx.row.c}</p>
                <p>{ctx.row.d.game}</p>
              </div>
             )
          }
        ]
      }

## 国际化

```js

import { setLang } from "limbo-vue-components";
//当语言变化时调用
setLang("zh_cn");
setLang("en_us");
```
