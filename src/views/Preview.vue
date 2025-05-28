<template>
  <div class="preview-container">
    <div class="preview-header">
      <el-icon class="back-btn" @click="$router.go(-1)">
        <ArrowLeft />
      </el-icon>
      <h2>预览模式</h2>
    </div>
    
    <div class="preview-content" :class="viewType" :style="canvasStyle">
      <div v-if="loading" class="loading-mask">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      
      <template v-else-if="project">
        <component 
            v-for="(component, index) in project.components" 
            :key="index"
            :is="component.type"
            :style="{ position: 'absolute', left: component.x + 'px', top: component.y + 'px', ...componentStyles[index] }"
            v-bind="component.props"
            v-model="componentDefaultValues[index]"
            @click="handleClick(component, index)"
            @dbclick="handleDoubleClick(component, index)"
            @change="handleSelectChange(index, $event)"
            >
            <template v-if="component.type === 'el-button' || component.type === 'van-button' || component.type === 'el-text' || component.type === 'el-divider'">
              {{ component.props.placeholder }}
            </template>
            <template v-else-if="component.type === 'el-select' || component.type === 'van-picker'">
              <template v-if="component.props.options?.options?.length > 0">
                  <el-option
                    v-if="component.type === 'el-select'"
                    v-for="(option, i) in component.props.options.options"
                    :key="i"
                    :label="option.label"
                    :value="option.value"
                  />
                <template v-else>
                  {{ component.props.options.options[component.props.options.default]?.label || component.props.options.options[0]?.label }}
                </template>
              </template>
            </template>
            <template v-else-if="component.type === 'el-checkbox'">
              {{ component.props.label }}
            </template>
            <template v-else-if="component.type === 'el-table'">
              <el-table-column
                v-for="(column, i) in component.props.columns.columns"
                :key="i"
                :prop="column.prop"
                :label="column.label"
              />
            </template>
        </component>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Loading, ArrowLeft } from '@element-plus/icons-vue';
import { Project } from '../stores/canvas';

export default defineComponent({
  name: 'Preview',
  components: {
    Loading
  },
  setup() {
    const route = useRoute();
    const project = ref<Project | null>(null);
    const loading = ref(true);
    const viewType = ref<'pc' | 'mobile'>('pc');
    const canvasStyle = ref<Record<string, any>>({})
    
    onMounted(() => {
      const projectId = route.query.projectId as string;
      loadProject(projectId);
    });

    const componentStyles = computed(() => {
      if (!project.value) return [];
      return project.value.components.map(component => {
        const styles = {...component.styles};
        if (styles.width && typeof styles.width === 'number') {
          styles.width = `${styles.width}${styles.widthUnit}`;
        }
        if (styles.height && typeof styles.height === 'number') {
          styles.height = `${styles.height}${styles.heightUnit}`;
        }
        if (styles.fontSize && typeof styles.fontSize === 'number') {
          styles.fontSize = `${styles.fontSize}px`;
        }
        return styles;
      });
    });

    const componentDefaultValues = computed(() => {
      if (!project.value) return [];
      return project.value.components.map(component => {
        if (component.type === 'el-select' || component.type === 'van-picker') {
          return component.props.options?.default ?? undefined
        } else if (component.type === 'el-button' || component.type === 'van-button') {
          return component.props.placeholder ?? ''
        } else if (component.type === 'el-checkbox' || component.type === 'van-checkbox') {
          return component.props.checked ?? false
        } else if (component.type === 'el-radio' || component.type === 'van-radio') {
          return component.props.checked ?? false
        } else if (component.type === 'QuestionRenderer') {
          return component.props.queIndex ?? 0
        } else if (component.type === 'el-input') {
          return component.props.value ?? ''
        } else if (component.type === 'el-switch') {
          return component.props.value ?? false
        }
        return ''
      })
    })
    
    const loadProject = (projectId: string) => {
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        try {
          const projects = JSON.parse(savedProjects) as Project[];
          const foundProject = projects.find(p => p.id === projectId);
          if (foundProject) {
            project.value = foundProject;
            viewType.value = foundProject.viewType || 'pc';
            canvasStyle.value = foundProject.canvasStyle || {};
          }
        } catch (e) {
          console.error('加载项目失败:', e);
        } finally {
          loading.value = false;
        }
      } else {
        loading.value = false;
      }
    };
    
    const handleSelectChange = (index: number, value: any) => {
      if (project.value && project.value.components[index].type === 'el-select') {
        project.value.components[index].props.options.default = value;
      } else if (project.value && project.value.components[index].type === 'el-switch') {
        project.value.components[index].props.default = value;
      }
    };

    const handleClick = (component: any, index: number) => {
      if (!component.events) return;
      if(component.events.eventType === 'click'){
        if(component.events.action === 'navigate'){
          window.open(component.events.url, '_blank');
        }
      }
    }
    const handleDoubleClick = (component: any, index: number) => {
      if (!component.events) return;
      if(component.events.eventType === 'dbclick'){
        if(component.events.action === 'navigate'){
          window.open(component.events.url, '_blank');
        }
      }
    }

    return {
      project,
      loading,
      viewType,
      canvasStyle,
      componentStyles,
      componentDefaultValues,
      handleSelectChange,
      handleClick,
      handleDoubleClick
    };
  }
});
</script>

<style lang="less" scoped>
.preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
  position: relative;
  
  .back-btn {
    position: absolute;
    left: 10px;
    cursor: pointer;
    font-size: 20px;
  }
}

.preview-content {
  // flex: 1;
  flex: 0 0 auto;
  overflow: auto;
  position: relative;
  margin: 0 auto;
  
  &.pc {
    background-color: #f5f5f5;
  }
  
  &.mobile {
    max-width: 414px;
    margin: 0 auto;
    background-color: #f5f5f5;
    min-height: 736px;
  }
}

.loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  
  .el-icon {
    font-size: 32px;
    margin-bottom: 16px;
  }
}
</style>