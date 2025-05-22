<!--
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-04-17 16:02:19
 * @LastEditors: zwcong
 * @LastEditTime: 2025-05-09 11:32:44
-->
<template>
  <header class="header">
    <div class="header-left">
      <el-icon class="back-btn" @click="$router.go(-1)">
        <ArrowLeft />
      </el-icon>
      <div class="name-editor">
        <el-input v-model="projectName" v-if="isEditing" @blur="saveName" />
        <span v-else @click="startEditing">{{ projectName }}</span>
        <el-button @click="isEditing ? saveName() : startEditing()">
          {{ isEditing ? '保存' : '编辑' }}
        </el-button>
      </div>
    </div>
    <div class="action-buttons">
      <el-button @click="saveCanvas" type="primary">保存</el-button>
      <!-- <el-button @click="previewCanvas">预览</el-button> -->
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useCanvasStore } from '../stores/canvas';

export default defineComponent({
  name: 'Header',
  emits: [ 'save-canvas', 'preview-canvas', 'save-name'],
  setup(props, { emit }) {
    const canvasStore = useCanvasStore();
    const projectName = ref(canvasStore.projectName);
    const isEditing = ref(false);

    console.log('projectName', projectName.value)
    
    const saveCanvas = () => {
      emit('save-canvas');
    };
    
    const previewCanvas = () => {
      emit('preview-canvas');
    };
    
    const startEditing = () => {
      isEditing.value = true;
    };
    
    const saveName = () => {
      isEditing.value = false;
      canvasStore.projectName = projectName.value;
      emit('save-name', projectName.value);
    };
    
    return {
      saveCanvas,
      previewCanvas,
      projectName,
      isEditing,
      startEditing,
      saveName
    };
  }
});
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
  height: 60px;
  box-sizing: border-box;

  .header-left {
    position: relative;
    display: flex;
    align-items: center;

    .back-btn {
      position: absolute;
      left: 0;
      font-size: 20px;
      cursor: pointer;
      color: #606266;
      &:hover {
        color: #409eff;
      }
    }
  }
}

.name-editor {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 30px;
}


</style>