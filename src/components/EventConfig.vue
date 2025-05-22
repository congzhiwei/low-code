<!--
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-05-07 11:43:12
 * @LastEditors: zwcong
 * @LastEditTime: 2025-05-07 15:40:13
-->
<template>
  <div class="event-config">
    <div class="config-item">
      <span class="label">事件类型：</span>
      <el-select v-model="propsConfig.eventType" placeholder="请选择事件类型" @change="handleEventChange" size="small">
        <el-option v-for="event in eventConfigStore.eventTypes" :key="event.value" :label="event.label" :value="event.value"></el-option>
      </el-select>
    </div>
    
    <template v-if="propsConfig.eventType">
      <div class="config-item">
        <span class="label">{{ getEventTypeLabel }}事件：</span>
        <el-select v-model="propsConfig.action" placeholder="请选择动作" @change="updateEvents" size="small">
          <el-option v-for="action in eventConfigStore.actionTypes" :key="action.value" :label="action.label" :value="action.value"></el-option>
        </el-select>
      </div>
      
      <template v-if="propsConfig.action === 'navigate'">
        <div class="config-item">
          <span class="label">跳转链接：</span>
          <el-input v-model="propsConfig.url" placeholder="请输入跳转链接" size="small" @input="updateEvents"></el-input>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useCanvasStore } from '../stores/canvas';
import { useEventConfigStore } from '../stores/event-config';

export default defineComponent({
  name: 'EventConfig',
  props: {
    propsConfig: {
      type: Object,
      required: true
    },
    componentType: {
      type: String,
      required: true
    }
  },
  emits: ['update'],
  setup() {
    const canvasStore = useCanvasStore();
    const eventConfigStore = useEventConfigStore();
    return { canvasStore, eventConfigStore };
  },
  computed: {
    getEventTypeLabel() {
      return this.eventConfigStore.eventTypes.find(e => e.value === this.propsConfig.eventType)?.label || '';
    }
  },
  methods: {
    handleEventChange() {
      this.propsConfig.action = '';
      this.propsConfig.url = '';
      this.updateEvents();
    },
    updateEvents() {
      this.$emit('update', this.propsConfig);
    }
  }
});
</script>

<style lang="less" scoped>
.event-config {
  .config-item {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    font-size: 12px;
    
    .label {
      width: 90px;
      text-align: right;
      padding-right: 12px;
    }
  }
}
</style>