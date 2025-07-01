/*
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-04-17 15:07:18
 * @LastEditors: zwcong
 * @LastEditTime: 2025-07-01 17:31:53
 */
import { defineStore } from 'pinia'
import defaultWidths from './defaultWidths'
import defaultData from './defaultData'
import { Component, CanvasStyle, Project } from './types'
import { cloneDeep } from 'lodash'

const unitOptions = ['px', '%'] as const

const sizeStyles = {
  width: { name: '宽度(px)', type: 'input-select', options: unitOptions, key: 'widthUnit' },
  height: { name: '高度(px)', type: 'input-select', options: unitOptions, key: 'heightUnit' },
}

const dataOptions = [
  { label: '自定义', value: 'custom' },
  { label: '关联数据', value: 'related' }
]

const componentConfigs: Record<string, any> = {
  'el-text': {
    props:{
      type: { name: '文本类型', type: 'radio', options: ['primary','success', 'warning', 'danger', 'info'] },
      placeholder: { name: '文本内容', type: 'input' },
      size: { name: '文本大小', type: 'radio', options: ['default', 'small', 'large']},
    },
    styles: {
      ...sizeStyles,
      fontSize: { name: '文本大小(px)', type: 'input' },
      color: { name: '文本颜色', type: 'color' },
      fontWeight: { name: '字体粗细', type: 'radio', options: ['normal','bold', 'lighter']},
      fontStyle: { name: '字体样式', type: 'radio', options: ['normal','italic']},
      textDecoration: { name: '文本装饰', type: 'radio', options: ['none','underline', 'line-through']},
      backgroundColor: { name: '背景颜色', type: 'color' },
    }
  },
  'el-button': {
    props: {
      type: { name: '按钮类型', type: 'radio', options: ['primary', 'success', 'warning', 'danger', 'info'] },
      placeholder: { name: '按钮文本', type: 'input' },
      size: { name: '按钮大小', type: 'radio', options: ['default', 'small', 'large']},
      plain: { name: '是否朴素按钮', type: 'switch' },
      text: { name: '是否文字按钮', type:'switch' },
      link: { name: '是否链接按钮', type:'switch' },
      round: { name: '是否圆角按钮', type:'switch' },
      // disabled: { name: '是否禁用', type:'switch' }   todo 禁用以后选中不了了
    },
    styles: {
      ...sizeStyles,
      color: { name: '文本颜色', type: 'color' },
    }
  },
  'el-input': {
    props: {
      placeholder: { name: '占位文本', type: 'input' },
      clearable: { name: '可清除', type: 'switch' }
    },
    styles: {
      ...sizeStyles,
    }
  },
  'el-select': {
    props: {
      placeholder: { name: '占位文本', type: 'input' },
      clearable: { name: '可清除', type: 'switch' },
      options: { name: '选项', type: 'select-options', options: dataOptions },
    },
    styles: {
      ...sizeStyles,
    }
  },
  'el-checkbox': {
    props: {
      label: { name: '标签文本', type: 'input' },
      disabled: { name: '禁用', type:'switch' }
    },
    styles: {
      ...sizeStyles,
    }
  },
  'el-radio': {
    props: {
      label: { name: '文本', type: 'input' }
    },
    styles: {
      ...sizeStyles,
    }
  },
  'el-switch': {
    props: {
      size: { name: '尺寸', type: 'radio', options: ['default', 'small', 'large']},
      activeText: { name: '激活时的文字', type: 'input' },
      inactiveText: { name: '非激活时的文字', type: 'input' },
      inlinePrompt: { name: '是否内联', type:'switch' },
      disabled: { name: '是否禁用', type:'switch' },
    },
    styles: {
      ...sizeStyles,
    }
  },
  'el-slider': {
    props: {
      size: { name: '尺寸', type: 'radio', options: ['default','small', 'large']},
      min: { name: '最小值', type: 'input' },
      max: { name: '最大值', type: 'input' },
    },
    styles: {
      ...sizeStyles,
    }
  },
  'el-image': {
    props: {
      src: { name: '上传图片', type: 'upload' },
      alt: { name: '替代文本(原生alt)', type: 'input' },
      fit: { name: '图片适应方式', type: 'radio', options: ['fill','contain', 'cover', 'none', 'scale-down']},
      lazy: { name: '懒加载', type:'switch' },
    },
    styles: {
      ...sizeStyles,
    }
  },
  'el-divider': {
    props: {
      direction: { name: '方向', type: 'radio', options: ['horizontal','vertical']},
      contentPosition: { name: '文本位置', type: 'radio', options: ['left','center', 'right']},
      borderStyle: { name: '边框样式', type: 'radio', options: ['dashed','dotted', 'solid']},
      placeholder: { name: '文本内容', type: 'input' }
    },
    styles: {
      ...sizeStyles,
      borderColor: { name: '线条颜色', type: 'color' },
    }
  },
  'el-table': {
    props: {
      columns: { name: '列配置', type: 'columns', options: dataOptions },
      data: { name: '数据', type: 'row' },
      stripe: { name: '是否显示斑马线', type: 'switch' },
      border: { name: '是否显示边框', type: 'switch' },
      size: { name: '表格大小', type: 'radio', options: ['default', 'small', 'large']},
      'header-cell-style': { name: '表头样式', type: 'css', values: [{name: '背景颜色', type: 'color', key:'backgroundColor'}, {name: '字体颜色', type: 'color', key:'color'}]},
      'cell-style': { name: '单元格样式', type: 'css', values: [{name: '背景颜色', type: 'color', key:'backgroundColor'}, {name: '字体颜色', type: 'color', key:'color'}]},
    },
    styles: {
      ...sizeStyles,
      '--el-table-border-color': { name: '线条颜色', type: 'color' },
    }
  },
  'van-button': {
    props: {
      type: { type: 'radio', options: ['primary', 'success', 'warning', 'danger', 'default'] },
      placeholder: { name: '按钮文本', type: 'input' },
      size: { name: '按钮大小', type: 'radio', options: ['default', 'small', 'large']},
      plain: { name: '是否朴素按钮', type: 'switch' },
      text: { name: '是否文字按钮', type:'switch' },
      link: { name: '是否链接按钮', type:'switch' },
      round: { name: '是否圆角按钮', type:'switch' },
      disabled: { name: '是否禁用', type:'switch' }
    },
    styles: {
      ...sizeStyles,
    }
  },
  'van-field': {
    props: {
      placeholder: { name: '占位文本', type: 'input' },
      clearable: { name: '可清除', type: 'checkbox' }
    },
    styles: {
      ...sizeStyles,
    }
  },
  'van-picker': {
    props: {
      columns: { type: 'select-options' }
    },
    styles: {
      ...sizeStyles,
    }
  },
  'van-checkbox': {
    props: {
      name: { name: '名称', type: 'input' }
    },
    styles: {
      ...sizeStyles,
    }
  },
  'van-radio': {
    props: {
      name: { name: '名称', type: 'input' }
    },
    styles: {
      ...sizeStyles,
    }
  },
  'c-pie-chart': {
    props: {
      title: { name: '标题', type: 'input' },
      titleAlign: { name: '标题对齐方式', type: 'radio', options: ['left','center', 'right']},
      tooltipTrigger: { name: '提示框触发方式', type: 'radio', options: ['item','axis']},
      tooltipFormatter: { name: '提示框内容格式', type: 'input' },
      legendOrient: { name: '图例方向', type: 'radio', options: ['vertical', 'horizontal']},
      legendAlign: { name: '图例对齐方式', type: 'radio', options: ['left','center', 'right']},
      legendData: { name: '图例数据', type: 'input' },
      columns: { name: '轴数据', type: 'columns', options: dataOptions },
      data: { name: '数据', type: 'row' },
      // yAxisData: { name: 'Y轴数据', type: 'table-columns', options: dataOptions },
      // seriesName: { name: '数据标题', type: 'input' },
      // seriesRadius: { name: '图例半径', type: 'input' },
      isShowRoseType: { name: '是否显示为南丁格尔图', type: 'switch'},
      seriesLabelShow: { name: '是否显示标签', type:'switch'},
      seriesInsideRadius: { name: '内径', type: 'slider' },
      seriesOutsideRadius: { name: '外径', type: 'slider' },
      // seriesCenter: { name: '图例中心', type: 'input' },
      emphasisItemShadowBlur: { name: '高亮时的阴影模糊大小', type: 'input' },
      emphasisItemShadowOffsetX: { name: '高亮时的阴影水平偏移', type: 'input' },
      emphasisItemShadowColor: { name: '高亮时的阴影颜色', type: 'color' },
    },
    styles: {
     ...sizeStyles,
    }
  },
  'c-line-chart': {
    props: {
      title: { name: '标题', type: 'input' },
      titleAlign: { name: '标题对齐方式', type: 'radio', options: ['left','center', 'right']},
      tooltipTrigger: { name: '提示框触发方式', type: 'radio', options: ['item','axis']},
      tooltipFormatter: { name: '提示框内容格式', type: 'input' },
      legendOrient: { name: '图例方向', type: 'radio', options: ['vertical', 'horizontal']},
      legendAlign: { name: '图例对齐方式', type: 'radio', options: ['left','center', 'right']},
      legendData: { name: '图例数据', type: 'input' },
      columns: { name: '轴数据', type: 'columns', options: dataOptions },
      data: { name: '数据', type: 'row' },
      // yAxisData: { name: 'Y轴数据', type: 'table-columns', options: dataOptions },
      // seriesName: { name: '数据标题', type: 'input' },
      seriesRadius: { name: '图例半径', type: 'input' },
      isSmooth: { name: '是否平滑', type:'switch'},
      // seriesCenter: { name: '图例中心', type: 'input' },
      emphasisItemShadowBlur: { name: '高亮时的阴影模糊大小', type: 'input' },
      emphasisItemShadowOffsetX: { name: '高亮时的阴影水平偏移', type: 'input' },
      emphasisItemShadowColor: { name: '高亮时的阴影颜色', type: 'color' },
    },
    styles: {
    ...sizeStyles,
    }
  },
  'c-bar-chart': {
    props: {
      title: { name: '标题', type: 'input' },
      titleAlign: { name: '标题对齐方式', type: 'radio', options: ['left','center', 'right']},
      tooltipTrigger: { name: '提示框触发方式', type: 'radio', options: ['item','axis']},
      tooltipFormatter: { name: '提示框内容格式', type: 'input' },
      legendOrient: { name: '图例方向', type: 'radio', options: ['vertical', 'horizontal']},
      legendAlign: { name: '图例对齐方式', type: 'radio', options: ['left','center', 'right']},
      legendData: { name: '图例数据', type: 'input' },
      columns: { name: '轴数据', type: 'columns', options: dataOptions },
      data: { name: '数据', type: 'row' },
      // yAxisData: { name: 'Y轴数据', type: 'table-columns', options: dataOptions },
      // seriesName: { name: '数据标题', type: 'input' },
      seriesRadius: { name: '图例半径', type: 'input' },
      // seriesCenter: { name: '图例中心', type: 'input' },
      emphasisItemShadowBlur: { name: '高亮时的阴影模糊大小', type: 'input' },
      emphasisItemShadowOffsetX: { name: '高亮时的阴影水平偏移', type: 'input' },
      emphasisItemShadowColor: { name: '高亮时的阴影颜色', type: 'color' },
    },
    styles: {
      ...sizeStyles,
    }
  },
  'QuestionRenderer': {
    props: {
      questionIds: { name: '题目ID', type: 'input', placeholder: '多个ID用英文逗号分隔'},
      hideDifficulty: { name: '隐藏难度', type: 'switch' },
      hideSource: { name: '隐藏来源', type: 'switch' },
      queIndex: { name: '题目序号', type: 'input', placeholder: '题目多个,序号从1开始如自定义会拼接,否则需要自定义' },
      analyzeVersion: { name: '解析版本', type: 'radio', options: [0, 1, 2] }
    },
    styles: {
      ...sizeStyles,
      color: { name: '文本颜色', type: 'color' },
      backgroundColor: { name: '背景颜色', type: 'color' }
    }
  }
} as const

const defaultProps: Record<string, Record<string, any>> = {
  'el-text': { placeholder: '文本内容', type: 'default', size: 'default', },
  'el-button': { placeholder: '按钮', type: 'primary', size: 'default', plain: false, text: false, link: false, round: false},
  'el-input': { placeholder: '请输入内容', clearable: true },
  'el-select': { placeholder: '请选择', clearable: true, options: { type: 'custom', options: [], default: undefined } },
  'el-checkbox': { label: '选项', disabled: false },
  'el-radio': { label: '选项' },
  'el-switch': { size: 'default', activeText: '', inactiveText: '', inlinePrompt: false, disabled: false, default: false },
  'el-slider': { size: 'default', min: 0, max: 100 },
  'el-image': { src: '', alt: '', fit: 'fill', previewSrcList: [], lazy: false },
  'el-divider': { direction: 'horizontal', contentPosition: 'center', borderStyle: 'solid', placeholder: '' },
  'el-table': { columns: { type: 'custom', columns: [], default: undefined }, data:[], stripe: false, border: false, size: 'default', 'header-cell-style': {'backgroundColor': '#FFF', 'color': '#000000'}, 'cell-style': {'backgroundColor': '#FFF', 'color': '#000000'}, rowTitles: null},
  'van-button': { placeholder: '按钮', type: 'primary', size: 'default', plain: false, text: false, link: false, round: false, disabled: false },
  'van-field': { placeholder: '请输入内容', clearable: true },
  'van-picker': { columns: { type: 'custom', options: [], default: undefined } },
  'van-checkbox': { name: '选项' },
  'van-radio': { name: '选项' },
  'c-pie-chart': { title: '饼图', titleAlign: 'center', tooltipTrigger: 'item', tooltipFormatter: '', isShowRoseType: false, seriesLabelShow: true, seriesInsideRadius: 0, seriesOutsideRadius: 50, seriesCenter: '', emphasisItemShadowBlur: 10, emphasisItemShadowOffsetX: 0, emphasisItemShadowColor: '#000', legendData: [],legendOrient: 'horizontal', legendAlign: 'left', columns: { type: 'custom', columns: cloneDeep(defaultData['c-pie-chart'].columns) , default: undefined }, data: cloneDeep(defaultData['c-pie-chart'].data), rowTitles: null, showAddRow: false},
  'c-line-chart': { title: '折线图', titleAlign: 'center', tooltipTrigger: 'item', tooltipFormatter: '', isSmooth: false , seriesRadius: '', seriesCenter: '', emphasisItemShadowBlur: 10, emphasisItemShadowOffsetX: 0, emphasisItemShadowColor: '#000', legendData: [], legendOrient: 'horizontal', legendAlign: 'left', columns: { type: 'custom', columns: cloneDeep(defaultData['c-line-chart'].columns) , default: undefined }, data: cloneDeep(defaultData['c-line-chart'].data), rowTitles: defaultData['c-line-chart'].rowTitles},
  'c-bar-chart': { title: '柱状图', titleAlign: 'center', tooltipTrigger: 'item', tooltipFormatter: '', seriesRadius: '', seriesCenter: '', emphasisItemShadowBlur: 10, emphasisItemShadowOffsetX: 0, emphasisItemShadowColor: '#000', legendData: [], legendOrient: 'horizontal', legendAlign: 'left', columns: { type: 'custom', columns: cloneDeep(defaultData['c-bar-chart'].columns) , default: undefined }, data: cloneDeep(defaultData['c-bar-chart'].data),  rowTitles: defaultData['c-bar-chart'].rowTitles},
  'QuestionRenderer': { questionIds: '5429b0311d5541d198357282fd4d70cf', hideDifficulty: false, hideSource: false, queIndex: '', analyzeVersion: 0 }
} as const

const defaultStyles: Record<string, Record<string, any>> = {
  'el-text': { width: defaultWidths['el-text'], height: 28, widthUnit: 'px', heightUnit: 'px', color: '', fontSize: '', fontWeight: '', fontStyle: '', textDecoration: '', backgroundColor: ''},
  'el-button': { width: defaultWidths['el-button'], height: 32, widthUnit: 'px', heightUnit: 'px', color: ''},
  'el-input': { width: defaultWidths['el-input'], height: 32, widthUnit: 'px', heightUnit: 'px'},
  'el-select': { width: defaultWidths['el-select'], height: 32, widthUnit: 'px', heightUnit: 'px' },
  'el-checkbox': { width: defaultWidths['el-checkbox'], height: 24, widthUnit: 'px', heightUnit: 'px' },
  'el-radio': { width: defaultWidths['el-radio'], height: 24, widthUnit: 'px', heightUnit: 'px' },
  'el-switch': { width: defaultWidths['el-switch'], height: 30, widthUnit: 'px', heightUnit: 'px'},
  'el-slider': { width: defaultWidths['el-slider'], height: 40, widthUnit: 'px', heightUnit: 'px' },
  'el-image': { width: defaultWidths['el-image'], height: 100, widthUnit: 'px', heightUnit: 'px' },
  'el-divider': { width: defaultWidths['el-divider'], height: 50, widthUnit: 'px', heightUnit: 'px', borderColor: '' },
  'el-table': { width: defaultWidths['el-table'], height: 300, widthUnit: 'px', heightUnit: 'px', '--el-table-border-color': ''},
  'van-button': { width: 60, height: '', widthUnit: 'px', heightUnit: 'px' },
  'van-field': { width: defaultWidths['van-field'], height: '', widthUnit: 'px', heightUnit: 'px' },
  'van-picker': { width: defaultWidths['van-picker'], height: '', widthUnit: 'px', heightUnit: 'px' },
  'van-checkbox': { width: '', height: '', widthUnit: 'px', heightUnit: 'px' },
  'van-radio': { width: '', height: '', widthUnit: 'px', heightUnit: 'px' },
  'c-pie-chart': { width: defaultWidths['c-pie-chart'], height: 200, widthUnit: 'px', heightUnit: 'px' }, 
  'c-line-chart': { width: defaultWidths['c-line-chart'], height: 200, widthUnit: 'px', heightUnit: 'px' },
  'c-bar-chart': { width: defaultWidths['c-bar-chart'], height: 200, widthUnit: 'px', heightUnit: 'px' },
  'QuestionRenderer': { width: defaultWidths['QuestionRenderer']('pc'), height: 300, widthUnit: 'px', heightUnit: 'px', color: '', backgroundColor: 'transparent'}
} as const

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
    components: [] as Component[],
    draggingComponent: null as string | null,
    selectedComponent: null as Component | null,
    selectedComponentIndex: -1 as number,
    componentConfigs: componentConfigs,
    projects: [] as Project[],
    currentProjectId: null as string | null,
    projectName: '我的项目' as string,
    currentView: 'pc' as 'pc' | 'mobile',
    canvasStyle: {
      width: '1920px',
      height: '1080px',
      margin: '0 auto',
      backgroundColor: '#fff',
      border: 'none',
    } as CanvasStyle
  }),
  actions: {
    setDraggingComponent(type: string) {
      this.draggingComponent = type
    },
    addComponent(component: Omit<Component, 'props'>) {
      this.components.push({
        ...component,
        props: defaultProps[component.type] ? cloneDeep(defaultProps[component.type]) : {},
        styles: defaultStyles[component.type] ? cloneDeep(defaultStyles[component.type]) : {},
        events: {}
      })
      console.log('this.components=====', this.components, defaultProps[component.type])
    },
    selectComponent(index: number) {
      this.selectedComponent = this.components[index]
    },
    updateComponentProps(index: number, props: Record<string, any>) {
      if (index >= 0 && index < this.components.length && this.components[index]) {
        this.components[index].props = {...props}
        this.components = [...this.components]
      }
    },
    
    deleteComponent(index: number) {
      if (index >= 0 && index < this.components.length) {
        this.components.splice(index, 1)
        this.components = [...this.components]
        if (this.selectedComponentIndex === index) {
          this.selectedComponentIndex = -1
          this.selectedComponent = null
        }
      }
    },
    // updateComponentPosition(index: number, x: number, y: number) {
    //   this.components[index].x = x
    //   this.components[index].y = y
    // },
    handleDrop(e: DragEvent, canvas: HTMLElement) {
      e.preventDefault()
      if (this.draggingComponent && canvas) {
        const rect = canvas.getBoundingClientRect()
        
        const scrollLeft = canvas.scrollLeft || canvas.offsetLeft
        const scrollTop = canvas.scrollTop || canvas.offsetTop
        console.log('rect=', rect, scrollLeft, scrollTop)
        const componentWidth = typeof defaultWidths[this.draggingComponent] === 'function' ? defaultWidths[this.draggingComponent](this.currentView) : defaultWidths[this.draggingComponent] || 100;
        this.addComponent({
          type: this.draggingComponent,
          x: e.clientX - rect.left + scrollLeft - componentWidth/2,
          y: e.clientY - rect.top + scrollTop - 20,
          // x: e.clientX - rect.left + scrollLeft,
          // y: e.clientY - rect.top + scrollTop,
          // width: componentWidth,
          styles: {},
          events: {},
        })
      }
    },
    handleDragOver(e: DragEvent) {
      e.preventDefault()
    },
    setCurrentView(view: 'pc' | 'mobile') {
      this.currentView = view
      this.canvasStyle = {
        ...this.canvasStyle,
        width: view === 'pc' ? '1920px' : '375px',
        height: view === 'pc' ? '1080px' : '667px'
      }
    },
    updateComponentStyles(index: number, styles: Record<string, any>) {
      if (index >= 0 && index < this.components.length && this.components[index]) {
        this.components[index].styles = {...styles}
        this.components = [...this.components]
      }
    },
    updateComponentEvents(index: number, events: Record<string, any>) {
      if (index >= 0 && index < this.components.length) {
        this.components[index].events = {...events}
        this.components = [...this.components]
      }
    },
  }
})