<!--
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-05-16 15:06:15
 * @LastEditors: zwcong
 * @LastEditTime: 2025-07-01 15:59:56
-->
<template>
  <div>
    <div v-if="propValue.type === 'custom'">
        <div v-for="(column, index) in propValue.columns" :key="index" class="column-row">
        <el-input v-model="column.label" placeholder="列名" size="small" @input="updateProps" />
        <el-input v-model="column.prop" placeholder="字段名" size="small" @input="updateProps" />
        <el-button type="danger" size="small" @click="removeColumn(index)">删除</el-button>
        </div>
        <el-button class="add-column-btn" type="primary" size="small" @click="addColumn">添加列</el-button>
    </div>
    <div v-else-if="propValue.type === 'related'">
      <ApiSelector 
        v-model="propValue.api" 
        :api-list="apiList"
        @show-api-dialog="showApiDialog"
        @api-change="handleApiChange"
      />
      <div v-if="propValue.apiData">
        <div v-for="(column, index) in propValue.columns" :key="index" class="column-row">
          <el-input v-model="column.label" placeholder="列名" size="small" @input="updateProps" />
          <el-select 
            v-model="column.prop" 
            placeholder="选择字段" 
            size="small" 
            @change="updateTableFromApi">
            <el-option 
              v-for="field in getApiFields()" 
              :key="field" 
              :label="field" 
              :value="field" />
          </el-select>
          <el-button type="danger" size="small" @click="removeColumn(index)">删除</el-button>
        </div>
        <el-button class="add-column-btn" type="primary" size="small" @click="addColumn">添加列</el-button>
      </div>
    </div>
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import service from '../../api/request';
import ApiSelector from './ApiSelector.vue';

export default defineComponent({
  name: 'TableColumnsConfig',
  components: {
    ApiSelector
  },
  props: {
    propValue: {
      type: Object,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    },
    apiList: {
      type: Array as () => Array<{name: string, url: string}>,
      default: () => []
    }
  },
  emits: ['update:propValue', 'show-api-dialog', 'update:data'],
  methods: {
    updateProps() {
      this.$emit('update:propValue', this.propValue);
    },
    addColumn() {
      console.log('this.propValue', this.propValue)
      this.propValue.columns.push({
        label: '',
        prop: ''
      });
      this.updateProps();
    },
    removeColumn(index: any) {
      this.propValue.columns.splice(index, 1);
      this.updateProps();
    },
    handleApiChange() {
      this.updateProps();
      this.fetchApiData();
    },
    fetchApiData() {
      if (this.propValue.api) {
        service.post(this.propValue.api)
          .then((res:any) => {
            // this.propValue.apiData = res?.data || [];
            const data = res?.schoolList || [];
            this.propValue.apiData = Array.isArray(data) ? data : [];
            if (!this.propValue.columns) {
              this.propValue.columns = [];
            }
            this.updateProps();
          }).catch(error => {
            console.error('API调用失败:', error);
          });
      }
    },
    showApiDialog() {
      console.log('showApiDialog..')
      this.$emit('show-api-dialog');
    },
    getApiFields() {
      if (!this.propValue.apiData || this.propValue.apiData.length === 0) {
        return [];
      }
      return Object.keys(this.propValue.apiData[0]);
    },
    updateTableFromApi() {
      if (!this.propValue.apiData || !this.propValue.columns) return;
      
      // 过滤出有有效字段的列配置
      const validColumns = this.propValue.columns.filter((col:any) => col.prop);
      console.log('validColumns', validColumns)
      console.log('this.propValue.apiData', this.propValue.apiData)
      
      // 映射API数据到表格数据
      this.$emit('update:data', this.propValue.apiData.map((item:any) => {
        const row:any = {};
        validColumns.forEach((col:any) => {
          if (col.prop && item[col.prop] !== undefined) {
            row[col.prop] = item[col.prop];
          }
        });
        console.log('row', row)
        return row;
      }));
    },
  }
});
</script>

<style scoped>
.column-row {
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 8px;
}
.add-column-btn {
  margin-top: 8px;
}
.api-input-row {
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 8px;
}
</style>