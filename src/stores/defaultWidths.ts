const defaultWidths: Record<string, any> = {
  'el-text': 80,
  'el-button': 80,
  'el-input': 200,
  'el-select': 200,
  'el-checkbox': 20,
  'el-radio': 20,
  'el-slider': 200,
  'el-image': 100,
  'el-divider': 200,
  'el-table': 400,
  'van-button': 60,
  'van-field': 180,
  'van-picker': 180,
  'van-checkbox': 16,
  'van-radio': 16,
  'c-pie-chart': 200,
  'c-line-chart': 200,
  'c-bar-chart': 300,
  'QuestionRenderer': (viewType: 'pc' | 'mobile') => viewType === 'pc' ? 400 : 365
} as const

export default defaultWidths