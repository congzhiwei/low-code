/*
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-04-17 14:59:18
 * @LastEditors: zwcong
 * @LastEditTime: 2025-05-29 16:26:51
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { elementPlusComponents, vantComponents, customComponents, echartsComponents } from './ui-config'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import request from './api/request'

const app = createApp(App)
app.config.globalProperties.$axios = axios
app.config.globalProperties.$request = request
app.use(createPinia())
app.use(router)

// 全局注册Element Plus组件
Object.entries(elementPlusComponents).forEach(([name, component]) => {
  if (component.name) {
    app.component(component.name, component)
  }
})

// 全局注册Vant组件
Object.entries(vantComponents).forEach(([name, component]) => {
  if (component.name) {
    app.component(component.name, component)
  }
})

// 全局注册自定义组件
Object.entries(customComponents).forEach(([name, component]) => {
  if (component.name) {
    app.component(component.name, component)
  }
})

// 全局注册Echarts组件
Object.entries(echartsComponents).forEach(([name, component]) => {
  console.log('component', component, name)
  if (component.name) {
    if(component.name === 'echarts'){
      app.component('v-chart', component)
    }else{
      app.component(component.name, component)
    }
    
  }

})

// 全局注册Element Plus图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局注册ElMessage
app.config.globalProperties.$message = ElMessage
// 全局注册ElMessageBox
app.config.globalProperties.$msgbox = ElMessageBox
app.config.globalProperties.$alert = ElMessageBox.alert
app.config.globalProperties.$confirm = ElMessageBox.confirm

app.mount('#app')