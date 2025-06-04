<template>
  <div class="api-input-row">
    <el-button type="primary" size="small" @click="showApiDialog">添加API</el-button>
    <el-select 
      v-model="selectedApi" 
      placeholder="请选择API" 
      size="small" 
      @change="handleApiChange">
      <el-option 
        v-for="api in apiList" 
        :key="api.name" 
        :label="api.name" 
        :value="api.url" />
    </el-select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'ApiSelector',
  props: {
    apiList: {
      type: Array as () => Array<{name: string, url: string}>,
      default: () => []
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'show-api-dialog', 'api-change'],
  setup(props, { emit }) {
    const selectedApi = ref(props.modelValue);

    watch(() => props.modelValue, (newVal) => {
      selectedApi.value = newVal;
    });

    const showApiDialog = () => {
      emit('show-api-dialog');
    };

    const handleApiChange = (value: string) => {
      emit('update:modelValue', value);
      emit('api-change', value);
    };

    return {
      selectedApi,
      showApiDialog,
      handleApiChange
    };
  }
});
</script>

<style scoped>
.api-input-row {
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 8px;
}
</style>