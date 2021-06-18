<!-- Created by limbo <yykaue@qq.com> on 2019/7/23. -->
<template>
  <el-form
      ref="form"
      class="form"
      :label-width="formItem.labelWidth"
      :label-position="formItem.labelPosition || 'right'"
      :model="formItem.formList.constructor === Object ? formItem.formList : undefined"
      :rules="rules"
      @submit.native.prevent>
    <el-row :gutter="formItem.gutter || 0">
      <el-col
          v-for="(item, i) in formItem.formList"
          :key="i"
          :span="item.span || formItem.span">
        <el-form-item
            v-if="!item.disblock"
            :label="item.name"
            :prop="item.prop || `${i}.val`"
            :required="item.required">
          <!--input-->
          <template v-if="item.type === 'input'">
            <el-input
                v-model="item.val"
                @keyup.enter.native="search"
                :clearable="!(item.params && item.params.unClearable)"
                :disabled="item.params && item.params.disabled"
                :maxlength="item.maxlength"
                :show-word-limit="item.showWordLimit"
                :placeholder="`请输入${item.params ? (item.params.placeholder || '') : ''}`"></el-input>
          </template>
          <!--textarea-->
          <template v-else-if="item.type === 'textarea'">
            <el-input
                v-model="item.val"
                @keyup.enter.native="search"
                type="textarea"
                :disabled="item.params && item.params.disabled"
                :maxlength="item.maxlength"
                :show-word-limit="item.showWordLimit"
                :placeholder="`请输入${item.params ? (item.params.placeholder || '') : ''}`"
                :rows="item.rows">
            </el-input>
          </template>
          <!--input number-->
          <template v-else-if="item.type === 'inputNumber'">
            <el-input-number
                class="w100"
                v-model="item.val"
                @keyup.enter.native="search"
                :controls="false"
                :disabled="item.params && item.params.disabled"
                :min="item.params && item.params.min || 0"
                :max="item.params && item.params.max || 100000000000000000"
                :placeholder="`请输入${item.params ? (item.params.placeholder || '') : ''}`"
                :precision="item.params && item.params.precision || 0"></el-input-number>
          </template>
          <!--select-->
          <template v-else-if="item.type === 'select'">
            <el-select
                class="w100"
                v-model="item.val"
                @change="val => selectChange(item, val)"
                @keyup.enter.native="search"
                :multiple="(item.params && item.params.multiple)"
                :clearable="!(item.params && item.params.unClearable)"
                :disabled="item.params && item.params.disabled"
                :filterable="!(item.params && item.params.unfilterable)"
                :placeholder="`请选择${item.params.placeholder || ''}`">
              <el-option
                  v-for="(key, i) in options[item.params.option]"
                  :key="i"
                  :disabled="key[item.params.optionDisable]"
                  :label="key[item.params.optionVal]"
                  :value="key[item.params.optionKey]">
              </el-option>
            </el-select>
          </template>
          <!--switch-->
          <template v-else-if="item.type === 'switch'">
            <el-switch
                v-model="item.val"
                :active-text="item.params && item.params.activeText"
                :disabled="item.params && item.params.disabled"
                :inactive-text="item.params && item.params.inactiveText">
            </el-switch>
          </template>
          <!--cascader-->
          <template v-else-if="item.type === 'cascader'">
            <el-cascader
                class="w100"
                v-model="item.val"
                :clearable="!(item.params && item.params.unClearable)"
                :options="options[item.params.option]"
                :props="item.params.props"
                :filterable="!(item.params && item.params.unfilterable)"
                :placeholder="`请选择${item.params.placeholder || ''}`"
                @change="val => cascaderChange(item, val)"
                @active-item-change="val => cascaderActive(item, val)">
            </el-cascader>
          </template>
          <!--radio-->
          <template v-else-if="item.type === 'radio'">
            <el-radio-group
                v-model="item.val"
                @change="val => radioChange(item, val)"
                :disabled="item.params && item.params.disabled">
              <el-radio
                  v-for="(key, i) in options[item.params.option]"
                  :key="i"
                  :label="key[item.params.optionKey]"
                  :disabled="key.disabled">
                {{key[item.params.optionVal]}}
              </el-radio>
            </el-radio-group>
          </template>
          <!--checkBox-->
          <template v-else-if="item.type === 'checkBox'">
            <el-checkbox-group
                v-model="item.val"
                :disabled="item.params && item.params.disabled">
              <el-checkbox
                  v-for="(key, i) in options[item.params.option]"
                  :key="i"
                  :label="key[item.params.optionKey]">
                {{key[item.params.optionVal]}}
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <!--dateTimePicker-->
          <template v-else-if="item.type === 'dateTimePicker' ">
            <el-date-picker
                v-model="item.val"
                @change="val => changeDateTimePicker(val, item)"
                :align="item.params.align"
                :clearable="item.params.clearable"
                :default-time="item.params.defaultTime || (['daterange', 'datetimerange'].includes(item.params.type) ? [] : '')"
                :disabled="item.params && item.params.disabled"
                :editable="!item.params.uneditable"
                :format="item.params.format || 'yyyy-MM-dd HH:mm:ss'"
                :placeholder="`请选择${item.params.placeholder || ''}`"
                :picker-options="item.pickerOptions || {}"
                :style="item.params.style || `width: 100%`"
                :type="item.params.type || 'date'"
                :unlink-panels="item.params.type === 'daterange'"
                :value-format="item.params.valueFormat"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </template>
          <!--default-->
          <template v-else>
            <span>无此类型</span>
          </template>
        </el-form-item>
      </el-col>
      <el-col
          v-if="formItem.btnObj"
          :span="formItem.btnObj.span || formItem.span">
        <div :class="formItem.btnObj.className || 'form-btn'">
          <el-button size="small" type="primary" @click="search">{{formItem.btnObj.name || '搜索'}}</el-button>
          <el-button size="small" v-if="!formItem.btnObj.unReset" @click="reset">重置</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Col,
  DatePicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  Option,
  Radio,
  RadioGroup,
  Row,
  Select,
  Switch,
} from 'element-ui'
export default {
  name: 'KeFormItem',
  components: {
    'el-button': Button,
    'el-checkbox': Checkbox,
    'el-checkbox-group': CheckboxGroup,
    'el-col': Col,
    'el-date-picker': DatePicker,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-input-number': InputNumber,
    'el-option': Option,
    'el-radio': Radio,
    'el-radio-group': RadioGroup,
    'el-row': Row,
    'el-select': Select,
    'el-switch': Switch,
  },
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    formItem: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    paging: {
      type: Object,
      default: () => ({
        params: {
          current: 1
        }
      })
    }
  },
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {
    radioChange (item, val) {
      this.paging.params.current = 1
      this.$emit('radioChange', {
        type: 'radioChange',
        data: { item, val }
      })
    },
    selectChange (item, val) {
      this.paging.params.current = 1
      this.$emit('selectChange', {
        type: 'selectChange',
        data: { item, val }
      })
    },
    cascaderChange (item, val) {
      this.$emit('cascaderChange', {
        type: 'cascaderChange',
        data: { item, val }
      })
    },
    cascaderActive (item, val) {
      this.$emit('cascaderActive', {
        type: 'cascaderActive',
        data: { item, val }
      })
    },
    search () {
      this.paging.params.current = 1
      this.$emit('search', {
        type: 'search',
        data: null
      })
      // 兼容以前code
      this.$emit('propsFn', {
        type: 'formItemSearch',
        data: null
      })
    },
    reset () {
      this.paramsReset()
      this.$emit('reset', {
        type: 'reset',
        data: null
      })
      this.$tools.message('条件已重置')
    },
    changeDateTimePicker (val, item) {
      if (!val) {
        setTimeout(() => {
          item.val = undefined
        })
      }
    },
    paramsReset () {
      let list = this.formItem.formList
      if (list.constructor === Array) {
        list.forEach(item => {
          let value = undefined
          if (item.type === 'checkBox'
            || (item.type === 'dateTimePicker' && ['daterange', 'datetimerange'].includes(item.params.type))
            || (item.type === 'select' && item.params && item.params.multiple && !item.params.noNeed)) {
            value = []
          }
          item.val = value
        })
      } else if (list.constructor === Object) {
        // Object 可用 存疑 遍历时用的v-for="item in list"
        Object.keys(list).forEach(item => {
          list[item].val = undefined
        })
      }
    }
  }
}

</script>

<style scoped lang="scss">
  .form {
    .w100 {
      width: 100%;
    }
    ::v-deep .el-input-number .el-input__inner{
      text-align: left;
    }
    ::v-deep .el-checkbox-group{
      font-size: 1px
    }
  }
</style>
