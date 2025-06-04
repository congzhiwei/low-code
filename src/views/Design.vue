<template>
    <div class="app-container">
      <Header 
        @save-canvas="saveCanvas"
        @preview-canvas="previewCanvas"
        @save-name="(name) => canvasStore.projectName = name"
      />
  
      <div class="main-content">
        <ComponentLibrary 
          :current-view="currentView"
          @start-drag="startDrag"
        />
  
        <!-- <Canvas 
          :components="canvasStore.components"
          :currentView="currentView"
          @drop="handleDrop"
          @dragover="handleDragOver"
          ref="canvas"
        /> -->
        <Canvas 
          :components="canvasStore.components"
          :currentView="currentView"
          @dragover="handleDragOver"
          ref="canvas"
        />
  
        <PropertyPanel 
          :selected-component="canvasStore.selectedComponent"
        />
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, getCurrentInstance, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import dayjs from 'dayjs'
  import { useCanvasStore } from '../stores/canvas'
  import Header from '../components/Layout/Header.vue'
  import ComponentLibrary from '../components/Layout/ComponentLibrary.vue'
  import Canvas from '../components/Layout/Canvas.vue'
  import PropertyPanel from '../components/Layout/PropertyPanel.vue'
  import config from '../config'
  
  export default defineComponent({
    name: 'App',
    components: {
      Header,
      ComponentLibrary,
      Canvas,
      PropertyPanel
    },
    setup() {
        const { proxy } = getCurrentInstance() as any;
        const route = useRoute()
        const router = useRouter();

        const canvasStore = useCanvasStore()
        const canvas = ref<HTMLElement | null>(null)
        
        // 重置画布状态
        canvasStore.components = []
        canvasStore.selectedComponent = null
        const viewValue = route.query.view || config.defaultView;
        canvasStore.currentView = viewValue === 'pc' || viewValue === 'mobile' ? viewValue : 'pc';
        canvasStore.projectName = config.projectName

        // 如果有projectId则加载已有数据
        const projectId = route.query.projectId as string
        if (projectId) {
            const savedProjects = localStorage.getItem('projects')
            if (savedProjects) {
              const projects = JSON.parse(savedProjects)
              const project = projects.find((p: any) => p.id === projectId)
              if (project) {
                  canvasStore.components = project.components
                  canvasStore.selectedComponent = project.selectedComponent
                  canvasStore.currentView = project.viewType
                  canvasStore.projectName = project.name
                  // 添加这行代码来设置画布高度
                  canvasStore.canvasStyle = project.canvasStyle || { height: '100%' }
              }
              // project.components[8].styles['--el-table-border-color'] = '#000000'
              // project.components[8].props['header-cell-style'] = {backgroundColor: '#000000', color: '#ffffff'}
              // project.components[8].props['row-style'] = {backgroundColor: '#ffffff', color: '#000000'}
              // project.components[8].props['cell-style'] = {backgroundColor: '#ffffff', color: '#000000'}
              // project.components[10].styles['backgroundColor'] = '#ffffff'
            }
        }
      
      const saveCanvas = () => {
        const projectId = route.query.projectId as string;

        console.log('canvasStore', canvasStore)

        const canvasData = {
          id: projectId || Date.now().toString(),
          name: canvasStore.projectName || '我的项目',
          updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          viewType: canvasStore.currentView,
          components: JSON.parse(JSON.stringify(canvasStore.components)),
          selectedComponent: JSON.parse(JSON.stringify(canvasStore.selectedComponent)),
          canvasStyle: JSON.parse(JSON.stringify(canvasStore.canvasStyle))
        };
        console.log('保存的画布数据:', canvasData);
        
        // 保存到本地存储
        const savedProjects = localStorage.getItem('projects');
        let projects = [];
        if (savedProjects) {
          projects = JSON.parse(savedProjects);
        }
        
        if (projectId) {
          const index = projects.findIndex((p: any) => p.id === projectId);
          if (index !== -1) {
            projects[index] = canvasData;
          } else {
            projects.push(canvasData);
          }
        } else {
          projects.push(canvasData);
        }
        localStorage.setItem('projects', JSON.stringify(projects));
        
        // 显示保存成功提示
        proxy.$message.success(`项目"${canvasStore.projectName}"保存成功！`);
        
        // 更新路由参数中的projectId
        if (!projectId) {
          router.replace({ 
            query: { 
              ...route.query,
              projectId: canvasData.id 
            } 
          });
        }
        
        // 添加发送到服务器的逻辑
        // axios('/api/save', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(canvasData)
        // });
      }
      
      const previewCanvas = () => {
        // 预览画布逻辑
      }
      
      const startDrag = (componentType: string) => {
        canvasStore.setDraggingComponent(componentType)
      }
      
      // const handleDrop = (e: DragEvent) => {
      //   canvasStore.handleDrop(e, canvas.value!)
      // }
      
      const handleDragOver = (e: DragEvent) => {
        canvasStore.handleDragOver(e)
      }
      
      return {
        currentView: computed(() => canvasStore.currentView),
        saveCanvas,
        previewCanvas,
        startDrag,
        // handleDrop,
        handleDragOver,
        canvas,
        canvasStore,
      }
    }
  })
  </script>
  
  <style scoped>
  .app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #f0f0f0;
    border-bottom: 1px solid #ddd;
  }
  
  .main-content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  
  .canvas-container {
    flex: 1;
    padding: 10px;
    overflow: auto;
    position: relative;
  }
  
  .canvas {
    min-height: 100%;
    background: #fff;
    box-shadow: 0 0 5px rgba(0,0,0,0.1);
  }
  </style>