<template>
  <div>
      <el-table :data="propValue" border size="small">
        <el-table-column label="标题" v-if="rowTitles && columns && columns.length">
          <template #default="scope">
            <el-input
              v-model="rowTitles[scope.$index]"
              size="small"
              @input="updateProps" />
          </template>
        </el-table-column>
        <el-table-column 
          v-for="(col, colIndex) in columns" 
          :key="colIndex" 
          :prop="col.prop" 
          :label="col.label">
          <template #default="scope">
            <el-input 
              v-model="scope.row[col.prop]" 
              size="small" 
              @input="updateProps" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="65" v-if="columns && columns.length">
          <template #default="scope">
            <el-button 
              type="danger" 
              size="small" 
              @click="removeRow(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button 
        v-if="showAddRow"
        type="primary" 
        size="small" 
        @click="addRow"
        style="margin-top: 8px;">
        添加行
      </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface TableRow {
  [key: string]: any;
}

export default defineComponent({
  name: 'TableDataConfig',
  props: {
    propValue: {
      type: Array as () => Array<TableRow>,
      required: true
    },
    columns: {
      type: Array as () => Array<{ label: string, prop: string }>,
      required: true
    },
    rowTitles: {
      type: Array as () => string[],
    },
    showAddRow: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:propValue'],
  methods: {
    updateProps() {
      this.$emit('update:propValue', this.propValue);
    },
    addRow() {
      //先添加列才能添加行
      if (!this.columns || this.columns.length === 0) {
        this.$message({
          message: '请先添加列',
          type: 'warning',
        })
        return;
      }

      const newRow: TableRow = {};
      this.columns.forEach((col:any) => {
        newRow[col.prop] = '';
      })
      this.propValue.push(newRow);


      this.updateProps();
    },
    removeRow(index: number) {
      this.propValue.splice(index, 1);
      this.updateProps();
    },
  }
});
</script>

<style scoped>
.option-row{
    margin-top: 8px;
}
.api-input-row {
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 8px;
}

.column-manager {
  margin-bottom: 16px;
}

.column-row {
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 8px;
}
</style>