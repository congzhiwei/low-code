/*
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-05-07 13:41:27
 * @LastEditors: zwcong
 * @LastEditTime: 2025-05-07 13:41:28
 */
import { defineStore } from 'pinia';

export const useEventConfigStore = defineStore('eventConfig', {
  state: () => ({
    eventTypes: [
      { label: '点击', value: 'click' },
      { label: '双击', value: 'dblclick' },
      { label: '长按', value: 'longpress' }
    ],
    actionTypes: [
      { label: '跳转页面', value: 'navigate' },
      { label: '打开弹窗', value: 'openDialog' },
      { label: '关闭弹窗', value: 'closeDialog' }
    ],
    eventLabels: {
      click: '点击',
      dblclick: '双击',
      longpress: '长按'
    }
  })
});