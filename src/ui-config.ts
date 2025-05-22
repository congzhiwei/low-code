/*
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-04-17 15:33:02
 * @LastEditors: zwcong
 * @LastEditTime: 2025-05-12 14:54:40
 */
import { ElButton, ElInput, ElSelect, ElOption, ElCheckbox, ElRadio, ElRadioButton, ElRadioGroup, ElTabs, ElTabPane, ElIcon, ElSwitch, ElTag, ElDialog, ElForm, ElFormItem, ElTable, ElTableColumn, ElColorPicker, ElText, ElSlider, ElImage, ElUpload, ElDivider } from 'element-plus'
import { Button as VanButton, Field as VanField, Picker as VanPicker, Checkbox as VanCheckbox, Radio as VanRadio } from 'vant'
import QuestionRenderer from './customComponents/QuestionRenderer.vue';
import 'element-plus/dist/index.css'
import 'vant/lib/index.css'

export const elementPlusComponents = {
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElCheckbox,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElTabs,
  ElTabPane,
  ElIcon,
  ElSwitch,
  ElTag,
  ElDialog,
  ElForm,
  ElFormItem,
  ElTable,
  ElTableColumn,
  ElColorPicker,
  ElText,
  ElSlider,
  ElImage,
  ElUpload,
  ElDivider
}

export const vantComponents = {
  VanButton,
  VanField,
  VanPicker,
  VanCheckbox,
  VanRadio
}

export const customComponents = {
  QuestionRenderer
}

export const uiStyles = [
  'element-plus/dist/index.css',
  'vant/lib/index.css',
]
