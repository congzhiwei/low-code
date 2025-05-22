<!--
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-04-18 16:21:08
 * @LastEditors: zwcong
 * @LastEditTime: 2025-05-08 14:14:30
-->
<template>
  <div class="question-renderer">
    <div 
      v-for="(ref, index) in questionRefs" 
      :key="index"
      :ref="el => { questionRefs[index] = el }"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from 'vue';
import { debounce } from 'lodash';
import service from '../api/request';
import config from '../config';

declare const TalqsTemplate: any;

export default defineComponent({
  name: 'QuestionRenderer',
  setup() {
    const questionRefs:any = ref(null);
    const questionList = ref([]);
    return {
      questionRefs,
      questionList
    };
  },
  props: {
    questionIds: {
      type: String,
    },
    hideDifficulty: {
      type: Boolean,
      default: false
    },
    hideSource: {
      type: Boolean,
      default: false
    },
    queIndex: {
      type: [Number, String],
      default: 1
    },
    analyzeVersion: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    // this.renderQuestion();
    this.getQuestionInfo()
  },
  watch: {
    questionIds: {
      handler: debounce(function() {
          // @ts-ignore
          this.getQuestionInfo();
      }, 1000),
      deep: true
    },
    hideDifficulty() {
        console.log('hideDifficulty changed', this.hideDifficulty);
        this.renderQuestion(this.questionList || []);
    },
    hideSource() {
        console.log('hideSource changed', this.hideSource); 
        this.renderQuestion(this.questionList || []);
    },
    queIndex() {
        console.log('queIndex changed', this.queIndex);
        this.renderQuestion(this.questionList || []);
    },
    analyzeVersion() {
        console.log('analyzeVersion changed', this.analyzeVersion);
        this.renderQuestion(this.questionList || []);
    }
  },
  methods: {
    getQuestionInfo()  { 
      // 这里可以根据 questionId 获取试题信息
      if (this.questionIds && this.questionIds.length > 0) {
        this.questionRefs = [];
        const questionIdsArray = this.questionIds.replace(/\s+/g, '').split(',');
        service.post(config.api.getQuestionList, {
          questionIds: questionIdsArray, isNeedSvg: 1
        })
          .then((res:any) => {
            // 触发题目渲染
            if (res && res.questionList) {
              this.questionList = res.questionList;
              this.renderQuestion(res.questionList);
            } else {
              console.warn('API返回结果为空或格式不正确:', res);
            }
          }).catch(error => {
            console.error('API调用失败:', error);
          });
      }
    },
    renderQuestion(res: any) {
      try {
        // const { default: { data: questionData } } = await import('../data/demo.json');
        // 根据API响应数据渲染多个题目
        if (res && Object.keys(res).length > 0) {
          // 确保refs数量与题目数量匹配
          const questions = Object.entries(res);
          this.questionRefs = [];
          questions.forEach(() => this.questionRefs.push(null));
          
          questions.forEach(([key, questionData], index) => {
            const questionTemplate = TalqsTemplate.render(questionData, {
              hideDifficulty: this.hideDifficulty,
              hideSource: this.hideSource,
              queIndex: Object.keys(res).length > 1 ? `${index+1}${this.queIndex}` : this.queIndex, // 使用题目索引
              analyzeVersion: this.analyzeVersion
            });
            nextTick(() => {
              if (this.questionRefs[index]) {
                this.questionRefs[index]!.innerHTML = questionTemplate;
              }
            });
          });
          
          nextTick(() => {
            TalqsTemplate.autoLayout();
          });
        }
      } catch (error) {
        console.error('试题渲染失败:', error);
      }
    }
  }
});
</script>

<style scoped>
#question {
  width: 100%;
  height: 100%;
}
</style>