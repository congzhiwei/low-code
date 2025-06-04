<template>
  <div>
    <div v-if="propValue.type === 'custom'">
      <el-radio-group v-model="propValue.default">
        <div v-for="(option, index) in propValue.options" :key="index" class="option-row">
          <el-radio :value="option.value" :label="index" size="small">
            <el-input v-model="option.label" placeholder="显示名" size="small" @input="updateProps" />
            <el-input v-model="option.value" placeholder="选项值" size="small" @input="updateProps" />
            <el-button type="danger" size="small" @click="removeOption(index)">删除</el-button>
          </el-radio>
        </div>
      </el-radio-group>
      <el-button class="add-option-btn" type="primary" size="small" @click="addOption">添加选项</el-button>
    </div>
    <div v-else-if="propValue.type === 'related'">
      <ApiSelector 
        v-model="propValue.api" 
        :api-list="apiList"
        @show-api-dialog="showApiDialog"
        @api-change="handleApiChange"
      />
      <div class="api-input-row" v-if="propValue.apiData">
        <el-select v-model="propValue.labelField" placeholder="选择显示名字段" size="small" @change="updateOptionsFromApi">
          <el-option v-for="field in Object.keys(propValue.apiData[0] || {})" :key="field" :label="field" :value="field" />
        </el-select>
        <el-select v-model="propValue.valueField" placeholder="选择选项值字段" size="small" @change="updateOptionsFromApi">
          <el-option v-for="field in Object.keys(propValue.apiData[0] || {})" :key="field" :label="field" :value="field" />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import service from '../../api/request';
import ApiSelector from './ApiSelector.vue';

export default defineComponent({
  name: 'SelectOptionsConfig',
  components: {
    ApiSelector
  },
  props: {
    propValue: {
      type: Object,
      required: true
    },
    apiList: {
      type: Array as () => Array<{name: string, url: string}>,
      default: () => []
    }
  },
  emits: ['update:propValue', 'show-api-dialog'],
  methods: {
    updateProps() {
      this.$emit('update:propValue', this.propValue);
    },
    addOption() {
      if (!this.propValue.options) {
        this.propValue.options = [];
      }
      this.propValue.options.push({
        label: '',
        value: ''
      });
      this.updateProps();
    },
    removeOption(index: number) {
      this.propValue.options.splice(index, 1);
      if (this.propValue.default === index) {
        this.propValue.default = undefined;
      } else if (this.propValue.default > index) {
        this.propValue.default--;
      }
      this.updateProps();
    },
    fetchApiData() {
      if (this.propValue.api) {
        service.post(this.propValue.api)
          .then((res:any) => {
            // todo
            const data = res?.schoolList || [];
            this.propValue.apiData = Array.isArray(data) ? data : [];
            this.updateProps();
          }).catch(error => {
            console.error('API调用失败:', error);
          });
      }
    },
    handleApiChange() {
      this.updateProps();
      this.fetchApiData();
    },
    updateOptionsFromApi() {
      if (this.propValue.apiData && this.propValue.labelField && this.propValue.valueField) {
        this.propValue.options = this.propValue.apiData.map((item: any) => ({
          label: item[this.propValue.labelField],
          value: item[this.propValue.valueField]
        }));
        this.updateProps();
      }
    },
    showApiDialog() {
      // 这里可以emit事件让父组件处理
      this.$emit('show-api-dialog');
    }
  }
});
</script>

<style scoped>
.option-row {
  display: flex;
  align-items: center;
  margin-top: 8px;
}
.option-row .el-input {
  margin-right: 8px;
  width: 120px;
}
.add-option-btn {
  margin-top: 8px;
}
.api-input-row {
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 8px;
}
</style>