<!-- Created by limbo <yykaue@qq.com> on 2021/9/10. -->
<template>
  <el-form
    ref="form"
    class="form"
    v-bind="formItem.attrs"
    v-loading="loading"
    :model="model"
    :rules="rules"
    :label-position="checkDefault(formItem, ['attrs', 'labelPosition'], 'right')"
    @submit.native.prevent
  >
    <el-row
      :gutter="formItem.gutter || 0"
      class="row-wrap"
    >
      <el-col
        v-for="(item, i) in formListFilter"
        :key="item.key || i"
        :span="item.span || formItem.span"
      >
        <el-form-item
          v-bind="item.headerAttrs"
          :prop="item.headerAttrs && item.headerAttrs.prop || item.key"
          :label="typeof item.name === 'function' ? item.name() : item.name"
        >
          <!-- slot="label" -->
          <RenderLabel
            v-if="item.renderLabel"
            slot="label"
            :model="model"
            :item="item"
          />
          <LabelTooltip
            v-else
            slot="label"
            :item="item" />
          <!-- input -->
          <template v-if="item.type === 'input'">
            <el-input
              v-model="model[item.key]"
              v-bind="item.contentAttrs"
              :clearable="checkDefault(item, ['contentAttrs', 'clearable'], true)"
              :placeholder="checkDefault(item, ['contentAttrs', 'placeholder'], `请输入${item.name}`)"
              @keyup.enter.native="search"
            />
          </template>
          <!--textarea-->
          <template v-else-if="item.type === 'textarea'">
            <el-input
              v-model="model[item.key]"
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
              v-model="model[item.key]"
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
              v-model="model[item.key]"
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
                :label="checkI18n(key[item.params.optionVal])"
                :value="key[item.params.optionKey]"
              />
            </el-select>
          </template>
          <!--switch-->
          <template v-else-if="item.type === 'switch'">
            <el-switch
              v-model="model[item.key]"
              v-bind="item.contentAttrs"
            />
          </template>
          <!--cascader-->
          <template v-else-if="item.type === 'cascader'">
            <el-cascader
              class="w100"
              v-model="model[item.key]"
              v-bind="item.contentAttrs"
              :options="checkOptions(options[item.params.option])"
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
              v-model="model[item.key]"
              v-bind="item.contentAttrs"
              @change="val => radioChange(item, val)"
            >
              <el-radio
                v-for="(key, index) in options[item.params.option]"
                :key="index"
                :label="checkI18n(key[item.params.optionKey])"
                :disabled="key[item.params.optionDisabled]"
              >
                {{ key[item.params.optionVal] }}
              </el-radio>
            </el-radio-group>
          </template>
          <!--checkBox-->
          <template v-else-if="item.type === 'checkBox'">
            <el-checkbox-group
              v-model="model[item.key]"
              v-bind="item.contentAttrs"
            >
              <el-checkbox
                v-for="(key, index) in options[item.params.option]"
                :key="index"
                :label="checkI18n(key[item.params.optionKey])"
                :disabled="key[item.params.optionDisabled]"
              >
                {{ key[item.params.optionVal] }}
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <!--dateTimePicker-->
          <template v-else-if="item.type === 'dateTimePicker' ">
            <el-date-picker
              v-model="model[item.key]"
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
          <!--button-->
          <template v-else-if="item.type === 'button' ">
            <el-button
              v-bind="item.contentAttrs"
              @click="buttonClick(item)"
            >
              {{ item.params.label }}
            </el-button>
          </template>
          <!--text-->
          <template v-else-if="item.type === 'text' ">
            <RenderItem
              :model="model"
              :item="item"
            />
          </template>
          <!--renderJson-->
          <template v-else-if="item.type === 'renderJson' ">
            <RenderJson
              :vue="$parent"
              :model="model"
              :options="options"
              :item="item"
              :props="item.props"
            />
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
        >
          <slot>
            <div :class="formItem.btnObj.className">
              <el-button
                v-if="(!formItem.btnObj.showList || formItem.btnObj.showList.includes('save'))"
                v-bind="formItem.btnObj.saveAttrs"
                :loading="saveLoading"
                type="primary"
                @click="save"
              >
                {{ checkDefault(formItem.btnObj, ['saveName', '确 定']) }}
              </el-button>
              <el-button
                v-if="(!formItem.btnObj.showList || formItem.btnObj.showList.includes('cancel'))"
                v-bind="formItem.btnObj.cancelAttrs"
                @click="cancel"
              >
                {{ checkDefault(formItem.btnObj, ['cancelName', '取 消']) }}
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
import RenderJson from './renderJson'
import RenderLabel from './renderLabel'
import LabelTooltip from './labelTooltip'

export default {
  name: 'KeFormModel',
  inheritAttrs: false,
  components: {
    RenderItem,
    RenderJson,
    RenderLabel,
    LabelTooltip
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    saveLoading: {
      type: Boolean,
      default: false
    },
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
    model: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
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
          return item.visible(this.model)
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
    checkI18n (payload) {
      return typeof payload === 'function' ? payload() : payload
    },
    checkOptions (options) {
      let needCopy
      if (options.constructor === Array) {
        needCopy = []
      } else {
        needCopy = {}
      }
      const stack = [{
        source: options,
        target: needCopy
      }]
      while (stack.length) {
        const { source, target } = stack.shift()
        for (const key in source) {
          const copyItem = source[key]
          if (copyItem && typeof copyItem === 'object') {
            if (copyItem.constructor === Array) {
              target[key] = []
            } else {
              target[key] = {}
            }
            stack.push({
              source: copyItem,
              target: target[key]
            })
          } else {
            if (key === 'label') {
              target[key] = this.checkI18n(copyItem)
            } else {
              target[key] = copyItem
            }
          }
        }
      }
      return needCopy
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
    buttonClick (item) {
      this.$emit('buttonClick', { item })
    },
    save () {
      this.submitForm(() => {
        this.$emit('save')
      })
    },
    cancel () {
      this.$emit('cancel')
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
    submitForm (cb) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          cb && cb()
        } else {
          this.$ElMessage({
            message: this.checkDefault(this.formItem.btnObj, ['submitMessage'], '请检查页面校验项'),
            type: 'error',
            duration: 3000
          })
        }
      })
    },
    resetForm () {
      this.$refs.form.resetFields()
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
