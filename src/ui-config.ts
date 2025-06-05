/*
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-04-17 15:33:02
 * @LastEditors: zwcong
 * @LastEditTime: 2025-06-05 14:10:17
 */
import { ElButton, ElInput, ElSelect, ElOption, ElCheckbox, ElRadio, ElRadioButton, ElRadioGroup, ElTabs, ElTabPane, ElIcon, ElSwitch, ElTag, ElDialog, ElForm, ElFormItem, ElTable, ElTableColumn, ElColorPicker, ElText, ElSlider, ElImage, ElUpload, ElDivider } from 'element-plus'
import { Button as VanButton, Field as VanField, Picker as VanPicker, Checkbox as VanCheckbox, Radio as VanRadio } from 'vant'
import QuestionRenderer from './customComponents/QuestionRenderer.vue';
import CBarChart from './chartComponents/BarChart.vue';
import CLineChart from './chartComponents/LineChart.vue';
import CPieChart from './chartComponents/PieChart.vue';
import { use } from 'echarts/core'
import { PieChart, LineChart, BarChart } from "echarts/charts";
import VueECharts from 'vue-echarts'
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
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

// 注册这些组件
use([
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer
])
export const echartsComponents = {
  // PieChart,
  // LineChart,
  // BarChart,
  // TitleComponent,
  // TooltipComponent,
  // GridComponent,
  // LegendComponent,
  // CanvasRenderer,
  CPieChart,
  CBarChart,
  CLineChart,
  VueECharts
}

export const uiStyles = [
  'element-plus/dist/index.css',
  'vant/lib/index.css',
]
