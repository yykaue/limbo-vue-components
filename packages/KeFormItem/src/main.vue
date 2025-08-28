<!-- Created by limbo <yykaue@qq.com> on 2019/7/23. -->
<template>
  <el-form
    ref="form"
    class="form"
    v-bind="formItem.attrs"
    :label-position="checkDefault(formItem, ['attrs', 'labelPosition'], 'right')"
    @submit.native.prevent
  >
    <el-row
      :gutter="formItem.gutter || 0"
      class="row-wrap"
    >
      <el-col
        v-for="(item, i) in formListFilter"
        :key="i"
        :span="item.span || formItem.span"
      >
        <el-form-item
          v-bind="item.headerAttrs"
          :label="typeof item.name === 'function' ? item.name() : item.name"
        >
          <!--input-->
          <template v-if="item.type === 'input'">
            <el-input
              v-model="item.val"
              v-bind="item.contentAttrs"
              :clearable="checkDefault(item, ['contentAttrs', 'clearable'], true)"
              :placeholder="checkDefault(item, ['contentAttrs', 'placeholder'], `请输入${item.name}`)"
              @keyup.enter.native="search"
            />
          </template>
          <!--textarea-->
          <template v-else-if="item.type === 'textarea'">
            <el-input
              v-model="item.val"
              v-bind="item.contentAttrs"
              type="textarea"
              :clearable="checkDefault(item, ['contentAttrs', 'clearable'], true)"
              :placeholder="checkDefault(item, ['contentAttrs', 'placeholder'], `请输入${item.name}`)"
              @keyup.enter.native="search"
            />
          </template>
          <!--input number-->
          <template v-else-if="item.type === 'inputNumber'">
            <el-input-number
              class="w100"
              v-model="item.val"
              v-bind="item.contentAttrs"
              :controls="checkDefault(item, ['contentAttrs', 'controls'], false)"
              :min="checkDefault(item, ['contentAttrs', 'min'], 0)"
              :max="checkDefault(item, ['contentAttrs', 'max'], 100000000000000000)"
              :precision="checkDefault(item, ['contentAttrs', 'precision'], 0)"
              :placeholder="checkDefault(item, ['contentAttrs', 'placeholder'], `请输入${item.name}`)"
              @keyup.enter.native="search"
            />
          </template>
          <!--select-->
          <template v-else-if="item.type === 'select'">
            <el-select
              class="w100"
              v-model="item.val"
              v-bind="item.contentAttrs"
              :clearable="checkDefault(item, ['contentAttrs', 'clearable'], true)"
              :filterable="checkDefault(item, ['contentAttrs', 'filterable'], true)"
              :placeholder="checkDefault(item, ['contentAttrs', 'placeholder'], `请选择${item.name}`)"
              @change="val => selectChange(item, val)"
              @keyup.enter.native="search"
            >
              <el-option
                v-for="(key, index) in options[item.params.option]"
                :key="index"
                :disabled="key[item.params.optionDisabled]"
                :label="key[item.params.optionVal]"
                :value="key[item.params.optionKey]"
              />
            </el-select>
          </template>
          <!--switch-->
          <template v-else-if="item.type === 'switch'">
            <el-switch
              v-model="item.val"
              v-bind="item.contentAttrs"
            />
          </template>
          <!--cascader-->
          <template v-else-if="item.type === 'cascader'">
            <el-cascader
              class="w100"
              v-model="item.val"
              v-bind="item.contentAttrs"
              :options="options[item.params.option]"
              :clearable="checkDefault(item, ['contentAttrs', 'clearable'], true)"
              :filterable="checkDefault(item, ['contentAttrs', 'filterable'], true)"
              :placeholder="checkDefault(item, ['contentAttrs', 'placeholder'], `请选择${item.name}`)"
              @change="val => cascaderChange(item, val)"
              @active-item-change="val => cascaderActive(item, val)"
            />
          </template>
          <!--radio-->
          <template v-else-if="item.type === 'radio'">
            <el-radio-group
              v-model="item.val"
              v-bind="item.contentAttrs"
              @change="val => radioChange(item, val)"
            >
              <el-radio
                v-for="(key, index) in options[item.params.option]"
                :key="index"
                :label="key[item.params.optionKey]"
                :disabled="key[item.params.optionDisabled]"
              >
                {{ key[item.params.optionVal] }}
              </el-radio>
            </el-radio-group>
          </template>
          <!--checkBox-->
          <template v-else-if="item.type === 'checkBox'">
            <el-checkbox-group
              v-model="item.val"
              v-bind="item.contentAttrs"
            >
              <el-checkbox
                v-for="(key, index) in options[item.params.option]"
                :key="index"
                :label="key[item.params.optionKey]"
                :disabled="key[item.params.optionDisabled]"
              >
                {{ key[item.params.optionVal] }}
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <!--dateTimePicker-->
          <template v-else-if="item.type === 'dateTimePicker' ">
            <el-date-picker
              v-model="item.val"
              v-bind="item.contentAttrs"
              :clearable="checkDefault(item, ['contentAttrs', 'clearable'], true)"
              :editable="checkDefault(item, ['contentAttrs', 'editable'], false)"
              :style="checkDefault(item, ['contentAttrs', 'style'], 'width:100%')"
              :value-format="checkDefault(item, ['contentAttrs', 'valueFormat'], 'timestamp')"

              :range-separator="checkDefault(item, ['contentAttrs', 'rangeSeparator'], '至')"
              :start-placeholder="checkDefault(item, ['contentAttrs', 'startPlaceholder'], '开始日期')"
              :end-placeholder="checkDefault(item, ['contentAttrs', 'endPlaceholder'], '结束日期')"
              :placeholder="checkDefault(item, ['contentAttrs', 'placeholder'], `请选择${item.name}`)"
              @change="val => changeDateTimePicker(val, item)"
            />
          </template>
          <!-- render -->
          <template v-else-if="item.type === 'render'">
            <RenderItem :item="item" />
          </template>
          <!--default-->
          <template v-else>
            <span>无此类型</span>
          </template>
        </el-form-item>
      </el-col>
      <el-col
        v-if="formItem.btnObj"
        :span="formItem.btnObj.span || formItem.span"
      >
        <el-form-item
          v-bind="formItem.btnObj.attrs"
          :label-width="checkDefault(formItem.btnObj, ['attrs', 'labelWidth'], '0px')"
        >
          <slot>
            <div :class="formItem.btnObj.className">
              <el-button
                v-if="!formItem.btnObj.showList || formItem.btnObj.showList.includes('search')"
                type="primary"
                @click="search"
              >
                {{ checkDefault(formItem.btnObj, ['searchName'], '搜索') }}
              </el-button>
              <el-button
                v-if="!formItem.btnObj.showList || formItem.btnObj.showList.includes('reset')"
                @click="reset"
              >
                {{ checkDefault(formItem.btnObj, ['resetName'], '重置') }}
              </el-button>
            </div>
          </slot>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import RenderItem from './render'

export default {
  name: 'KeFormItem',
  inheritAttrs: false,
  components: { RenderItem },
  props: {
    formItem: {
      type: Object,
      default: () => ({
        attrs: {},
        gutter: 10,
        span: 8,
        btnObj: {}
      })
    },
    // eslint-disable-next-line vue/require-default-prop
    formList: [Object, Array],
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {}
  },
  computed: {
    formListFilter () {
      return this.formList.filter(item => {
        if (item.visible && item.visible.constructor === Function) {
          return item.visible()
        } else if (item.visible === undefined) {
          return true
        } else {
          return item.visible
        }
      })
    }
  },
  mounted () {
  },
  methods: {
    checkDefault (target, list = [], defaultVal) {
      const payload = list.reduce((pre, cur, i, arr) => {
        let backParams
        if (pre[cur] === undefined) {
          if (i === arr.length - 1) {
            backParams = undefined
          } else {
            backParams = {}
          }
        } else {
          backParams = pre[cur]
          if (i === arr.length - 1 && typeof backParams === 'function') {
            backParams = backParams()
          }
        }
        return backParams
      }, target)
      if (payload === 'limboUndefined') {
        return undefined
      }
      return payload !== undefined ? payload : defaultVal
    },
    // --- emit start ---
    radioChange (item, val) {
      if (!this.$listeners.radioChange) {
        return
      }
      this.$emit('radioChange', { item, val })
    },
    selectChange (item, val) {
      if (!this.$listeners.selectChange) {
        return
      }
      this.$emit('selectChange', { item, val })
    },
    cascaderChange (item, val) {
      if (!this.$listeners.cascaderChange) {
        return
      }
      this.$emit('cascaderChange', { item, val })
    },
    cascaderActive (item, val) {
      if (!this.$listeners.cascaderActive) {
        return
      }
      this.$emit('cascaderActive', { item, val })
    },
    search () {
      if (!this.$listeners.search) {
        return
      }
      this.$emit('search')
    },
    reset () {
      this.resetParams()
      this.$emit('reset')
      this.$ElMessage({
        message: this.checkDefault(this.formItem.btnObj, ['resetMessage'], '条件已重置'),
        type: 'success',
        duration: 2000
      })
    },
    // --- emit end ---
    changeDateTimePicker (val, item) {
      if (!val) {
        setTimeout(() => {
          let value
          if (this.checkValueType(item)) {
            value = []
          }
          item.val = value
        })
      }
    },
    checkValueType (item) {
      return item.type === 'checkBox' ||
          (item.type === 'dateTimePicker' && item.contentAttrs && item.contentAttrs.type && item.contentAttrs.type.includes('range')) ||
          (item.type === 'select' && item.contentAttrs && item.contentAttrs.multiple)
    },

    /**
     *
     * @param exceptValList 需要被过滤的value type: Array exceptKeyList = ['']
     * @param exceptItemList 需要被过滤的formList属性 type: Array exceptItemList = [{ key: 'val', val: [undefined] }]
     */
    getParams (exceptValList = [''], exceptItemList = []) {
      const params = {}
      this.formList.forEach(item => {
        const keyFlag = exceptValList.includes(item.val)
        const itemFlag = exceptItemList.some(_item => _item.val.includes(item[_item.key]))

        if (item.val !== undefined && !keyFlag && !itemFlag) {
          params[item.key] = item.val
        }
      })
      return params
    },
    resetParams () {
      this.formList.forEach(item => {
        let value
        if (this.checkValueType(item)) {
          value = []
        }
        item.val = value
      })
    },
    setParams (params) {
      // hasOwnProperty
      this.formList.forEach(item => {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(item.key)) {
          item.val = params[item.key]
        }
      })
    }
  }
}

</script>

<style scoped lang="scss">
.form {
  .w100 {
    width: 100%;
  }
  .row-wrap{
    display: flex;
    flex-wrap: wrap;
  }

  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }

  ::v-deep .el-checkbox-group {
    font-size: 1px
  }
}
</style>
