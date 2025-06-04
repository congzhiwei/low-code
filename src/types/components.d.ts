/*
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-05-29 16:34:01
 * @LastEditors: zwcong
 * @LastEditTime: 2025-05-29 16:34:07
 */
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // 声明所有 .vue 文件导出的是 Vue 组件
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}