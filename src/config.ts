/*
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-04-23 14:14:57
 * @LastEditors: zwcong
 * @LastEditTime: 2025-05-08 14:14:44
 */
export default {
  api: {
    // 获取题目信息-批量
    getQuestionList: 'https://biz-beta.thethinkacademy.com/paper-storage/examSystem/getQuestionList',
  },
  projectName: '我的项目',
  defaultView: 'pc' as 'pc' | 'mobile',
  viewType: {
    pc: 'PC端',
    mobile: '移动端'
  }
}