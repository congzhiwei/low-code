/*
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-04-23 10:51:46
 * @LastEditors: zwcong
 * @LastEditTime: 2025-04-23 11:07:47
 */
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Dashboard from './views/Dashboard.vue';
import Design from './views/Design.vue';
import Preview from './views/Preview.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/design',
      name: 'Design',
      component: Design
    },
    {
      path: '/preview',
      name: 'Preview',
      component: Preview,
      props: route => ({ projectId: route.query.projectId })
    }
  ]
});

export default router;