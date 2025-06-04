<!--
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-04-17 16:02:49
 * @LastEditors: zwcong
 * @LastEditTime: 2025-05-29 16:49:48
-->
<template>
  <aside class="component-library">
    <h3 class="nav-title">组件库</h3>
    <el-tabs>
      <el-tab-pane label="通用组件">
        <div v-if="currentView === 'pc'" class="component-grid">
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('el-text', e)">
            <el-icon><Document /></el-icon>
            <span>文本</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('el-button', e)">
            <el-icon><User /></el-icon>
            <span>按钮</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('el-input', e)">
            <el-icon><Edit /></el-icon>
            <span>输入框</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('el-select', e)">
            <el-icon><Select /></el-icon>
            <span>选择器</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('el-checkbox', e)">
            <el-icon><Check /></el-icon>
            <span>复选框</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('el-radio', e)">
            <el-icon><CircleCheck /></el-icon>
            <span>单选框</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('el-switch', e)">
            <el-icon><Switch /></el-icon>
            <span>开关</span>
          </div>
          <!-- <div class="component-item" draggable="true" @dragstart="(e) => startDrag('el-slider', e)">
            <el-icon><QuestionFilled /></el-icon>
            <span>滑块</span>
          </div> -->
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('el-image', e)">
            <el-icon><Picture /></el-icon>
            <span>图片</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('el-divider', e)">
            <el-icon><Minus /></el-icon>
            <span>分割线</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('el-table', e)">
            <el-icon><Grid /></el-icon>
            <span>表格</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('c-pie-chart', e)">
            <el-icon><Grid /></el-icon>
            <span>饼图</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('c-line-chart', e)">
            <el-icon><Grid /></el-icon>
            <span>线型图</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('c-bar-chart', e)">
            <el-icon><Grid /></el-icon>
            <span>柱图</span>
          </div>
        </div>
        <div v-else class="component-grid">
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('van-button', e)">
            <el-icon><User /></el-icon>
            <span>按钮</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('van-field', e)">
            <el-icon><Edit /></el-icon>
            <span>输入框</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('van-picker', e)">
            <el-icon><Select /></el-icon>
            <span>选择器</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('van-checkbox', e)">
            <el-icon><Check /></el-icon>
            <span>复选框</span>
          </div>
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('van-radio', e)">
            <el-icon><CircleCheck /></el-icon>
            <span>单选框</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="自定义组件">
        <!-- 自定义组件列表 -->
        <div class="component-grid">
          <div class="component-item" draggable="true" @dragstart="(e) => startDrag('QuestionRenderer', e)">
            <el-icon><CircleCheck /></el-icon>
            <span>题目渲染</span>
          </div>
          <div class="component-item" draggable="true">
            <el-icon><CircleCheck /></el-icon>
            <span>分支视频todo...</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ComponentLibrary',
  props: {
    currentView: {
      type: String as () => 'pc' | 'mobile',
      required: true
    }
  },
  emits: ['start-drag'],
  setup(props, { emit }) {
    const startDrag = (componentType: string, event: DragEvent) => {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const offsetX = rect.width / 2;
      const offsetY = rect.height / 2;
      event.dataTransfer?.setDragImage(target, offsetX, offsetY);

      emit('start-drag', componentType);
    };
    
    return {
      startDrag
    };
  }
});
</script>

<style lang="less" scoped>
.component-library {
  width: 250px;
  padding: 10px;
  border-right: 1px solid #ddd;
  overflow-y: auto;

  .nav-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: move;
  transition: all 0.3s;
  font-size: 12px;

  &:hover {
    border-color: #409eff;
    color: #409eff;
  }

  .el-icon {
    margin-bottom: 4px;
    font-size: 20px;
  }
}
</style>