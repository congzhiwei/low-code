/*
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-04-30 17:45:09
 * @LastEditors: zwcong
 * @LastEditTime: 2025-05-07 16:32:44
 */
import axios from 'axios';
import { ElMessage } from 'element-plus';

const service = axios.create({
  baseURL: '/api',
  timeout: 5000
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以在这里添加token等

    if(config.url?.includes('/paper-storage')){
      config.headers['platformkey'] = 'ffa71a4dec99b9fcf0a281ae1d22772e'
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    console.log('res==', res)
    if (res.code !== 0) {
      ElMessage.error(res.msg || '请求失败');
      return Promise.reject(new Error(res.msg || 'Error'));
    } else {
      return res.data;
    }
  },
  error => {
    ElMessage.error(error.message || '请求失败');
    return Promise.reject(error);
  }
);

export default service;