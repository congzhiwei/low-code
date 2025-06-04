<template>
  <aside class="property-panel">
    <template v-if="selectedComponent">
      <h3 class="nav-title">属性设置</h3>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="属性" name="props"></el-tab-pane>
        <el-tab-pane label="样式" name="styles"></el-tab-pane>
        <el-tab-pane label="高级" name="advanced"></el-tab-pane>
      </el-tabs>
    </template>
    <div class="property-content">
        <template v-if="selectedComponent">
            <div v-show="activeTab === 'props'">
              <PropsConfig
                configType="props"
                :props-config="selectedComponent.props" 
                :component-type="selectedComponent.type"
                :api-list="apiList"
                @update="updateProps"
                @show-api-dialog="showApiDialog"
              />
            </div>
            <div v-show="activeTab === 'styles'">
              <PropsConfig
                configType="styles"
                :props-config="selectedComponent.styles" 
                :component-type="selectedComponent.type"
                :api-list="apiList"
                @update="updateStyles"
                @show-api-dialog="showApiDialog"
              />
            </div>
            <div v-show="activeTab === 'advanced'">
              <EventConfig
                :props-config="selectedComponent.events" 
                :component-type="selectedComponent.type"
                @update="updateEvents"
              />
            </div>
        </template>
        <template v-else>
            <div class="page-settings">
                <h3>页面设置</h3>
                <div class="setting-item">
                    <span>背景颜色：</span>
                    <el-color-picker v-model="canvasStore.canvasStyle.backgroundColor" @change="updateCanvasStyle" size="small" show-alpha />
                </div>
                <div class="setting-item">
                    <span>宽度：</span>
                    <el-input v-model="canvasStore.canvasStyle.width" @change="updateCanvasStyle" size="small" />
                </div>
                <div class="setting-item">
                    <span>高度：</span>
                    <el-input v-model="canvasStore.canvasStyle.height" @change="updateCanvasStyle" size="small" />
                </div>
            </div>
        </template>
    </div>
    <div class="property-footer">
      <el-button 
        v-if="canvasStore.selectedComponentIndex !== -1" 
        type="danger" 
        size="small" 
        @click="deleteComponent">
        删除
      </el-button>
    </div>
  </aside>
  <el-dialog v-model="apiDialogVisible" title="API管理" width="68%">
    <div class="api-form">
      <el-form label-width="80px" label-position="left">
        <el-form-item label="API名称：">
          <el-input v-model="newApi.name" placeholder="请输入API名称" />
        </el-form-item>
        <el-form-item label="API地址：" >
          <el-input v-model="newApi.url" placeholder="请输入API地址" />
        </el-form-item>
        <div class="api-form-btns">
          <el-button type="primary" @click="saveApi">添加</el-button>
        </div>
      </el-form>
      <el-table :data="apiList">
        <el-table-column prop="name" label="名称" width="120px" />
        <el-table-column prop="url" label="地址" />
        <el-table-column label="操作" width="80px">
          <template #default="scope">
            <el-button size="small" type="danger" @click="deleteApi(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useCanvasStore } from '../../stores/canvas';
import PropsConfig from '../Property/PropsConfig.vue';
import EventConfig from '../Property/EventConfig.vue';

export default defineComponent({
  name: 'PropertyPanel',
  props: {
    selectedComponent: {
      type: Object as () => {
        type: string;
        props: Record<string, any>;
        styles: Record<string, any>;
        events: Record<string, any>;
      } | null,
      required: true
    }
  },
  components: {
    PropsConfig,
    EventConfig
  },
  emits: ['update:props'],
  setup() {
    const canvasStore = useCanvasStore();
    const getPropType = (componentType: string, propKey: string) => {
      return canvasStore.componentConfigs[componentType]?.props[propKey]?.type;
    };
    const getPropName = (componentType: string, propKey: string) => {
      return canvasStore.componentConfigs[componentType]?.props[propKey]?.name;
    };
    const apiList = JSON.parse(localStorage.getItem('apiList') || '[]');

    const deleteComponent = () => {
      if (canvasStore.selectedComponentIndex !== -1) {
        canvasStore.deleteComponent(canvasStore.selectedComponentIndex);
      }
    };

    return { canvasStore, getPropType, getPropName, apiList, deleteComponent };
  },
  methods: {
    updateCanvasStyle() {
        this.canvasStore.canvasStyle = {...this.canvasStore.canvasStyle};
    },
    updateProps() {
      if (this.selectedComponent) {
        console.log('更新属性：', this.selectedComponent);

        const updatedProps = {...this.selectedComponent.props};
        
        // 确保options是独立的引用
        if (updatedProps.options) {
          updatedProps.options = {...updatedProps.options};
          if (updatedProps.options.options) {
            updatedProps.options.options = [...updatedProps.options.options];
          }
        }

        // tableData
        // if (updatedProps.dataSource) {
        //   if(updatedProps.dataSource.dataSource){
        //     updatedProps.dataSource = [...updatedProps.dataSource.dataSource];
        //   }
        //   if(updatedProps.dataSource.columns){
        //     updatedProps.columns = [...updatedProps.dataSource.columns];
        //   }
        // }
        
        // this.$emit('update:props', updatedProps);
        this.canvasStore.updateComponentProps(
          this.canvasStore.selectedComponentIndex,
          updatedProps
        );
      }
    },
    updateStyles() {
      if (this.selectedComponent) {
        console.log('更新样式：', this.selectedComponent);
        
        const updatedStyles = {...this.selectedComponent.styles};
        
        // 转换width和height为数字类型（如果是数字字符串）
        ['width', 'height', 'fontSize'].forEach(prop => {
          if (updatedStyles[prop] && !isNaN(updatedStyles[prop])) {
            updatedStyles[prop] = Number(updatedStyles[prop]);
          }
        });
        
        this.canvasStore.updateComponentStyles(
          this.canvasStore.selectedComponentIndex,
          updatedStyles
        );
      }
    },
    
    updateEvents() {
      if (this.selectedComponent && this.selectedEvent) {
        console.log('更新事件：', this.selectedComponent);
        
        const updatedEvents = {
          ...this.selectedComponent.events,
        };
        
        this.canvasStore.updateComponentEvents(
          this.canvasStore.selectedComponentIndex,
          updatedEvents
        );
      }
    },
    showApiDialog() {
      console.log('显示API对话框');
      this.apiDialogVisible = true;
    },
    saveApi() {
      if (!(this.newApi.name && this.newApi.url)) {
        return this.$message({
          message: '请输入API名称和地址',
          type:'warning'
        })
      }
      
      const isDuplicate = this.apiList.some((api:any) => api.name === this.newApi.name);
      if (isDuplicate) {
        return this.$message({
          message: 'API名称已存在，请使用其他名称',
          type: 'warning'
        });
      }
      
      this.apiList.push({...this.newApi});
      localStorage.setItem('apiList', JSON.stringify(this.apiList));
      this.$message({
        message: 'API已保存',
        type: 'success'
      })
      this.apiDialogVisible = false;
      this.newApi = {name: '', url: ''};
    },
    deleteApi(index: number) {
      this.apiList.splice(index, 1);
      localStorage.setItem('apiList', JSON.stringify(this.apiList));
    }
  },
  data() {
    return {
      activeTab: 'props',
      apiDialogVisible: false,
      newApi: {
        name: '',
        url: ''
      },
      apiList: [] as Array<{name: string, url: string}>,
      selectedEvent: '',
      selectedAction: '',
      navigateUrl: '',
      eventLabels: {
        click: '点击',
        dblclick: '双击',
        longpress: '长按'
      }
    };
  }
});
</script>

<style lang="less" scoped>
.property-panel {
  width: 340px;
  padding: 10px;
  border-right: none;
  border-left: 1px solid #ddd;
  overflow-y: auto;
  position: relative;

  .nav-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .property-content{
    overflow-y: auto;
    height: calc(100% - 125px);
  }

  .property-footer{
    position: absolute;
    bottom: 0;
    left:0;
    width: 100%;
    text-align: center;
    background: #FFF;
    // padding: 10px 0;
    box-shadow: 0 -1px 10px rgba(0,0,0,0.1);

    .el-button{
      margin: 10px 0;
    }
  }
}
.api-form {
  padding: 20px;
  
  .api-form-btns{
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    margin-bottom: 40px;
  }
}
.page-settings {
  h3{
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
    
  }
  .setting-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      
      span {
          width: 80px;
          font-size: 12px;
      }
  }
}
</style>