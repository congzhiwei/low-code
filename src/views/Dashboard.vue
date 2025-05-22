<template>
  <div class="dashboard-container">
    <h1>工作台</h1>
    <div class="entry-buttons">
      <el-button class="entry-button pc" type="primary" @click="createPC">创建PC端</el-button>
      <el-button class="entry-button mobile" type="success" @click="createMobile">创建移动端</el-button>
    </div>
    <template v-if="!projects.length">
      <p class="empty-message">暂无项目，请创建一个新的项目</p>
    </template>
    <div class="project-list">
      <el-card v-for="project in projects" :key="project.id" class="project-card">
        <div class="project-content">
          <div class="project-info">
            <h3>{{ project.name }}</h3>
            <p>最后修改: {{ project.updatedAt }}</p>
            <el-tag :type="project.viewType === 'pc' ? 'primary' : 'success'">
              {{ config.viewType[project.viewType] }}
            </el-tag>
            <el-tag class="project-status" type="warning">未发布</el-tag>
          </div>
          <div class="project-actions">
            <el-button @click="editProject(project.id)">编辑</el-button>
            <el-button @click="onPreview(project.id)">预览</el-button>
            <el-button @click="onPublish">发布</el-button>
          </div>
          <el-dropdown class="more-actions-dropdown">
            <el-icon class="more-actions"><MoreFilled /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="renameProject(project.id)">重命名</el-dropdown-item>
                <el-dropdown-item @click="duplicateProject(project.id)">创建副本</el-dropdown-item>
                <el-dropdown-item divided @click="deleteProject(project.id)" style="color: #F56C6C;">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
  import dayjs from 'dayjs'
import { ElCard, ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import { Project } from '../stores/canvas';
import config from '../config';

export default defineComponent({
  name: 'Dashboard',
  components: {
    ElCard,
    ElButton,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem
  },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const router = useRouter();
    const projects = ref<Project[]>([]);
    
    const createPC = () => {
      router.push({ name: 'Design', query: { view: 'pc' } });
    };
    
    const createMobile = () => {
      router.push({ name: 'Design', query: { view: 'mobile' } });
    };
    
    const editProject = (id: string) => {
      router.push({ name: 'Design', query: { projectId: id } });
    };

    const onPreview = (projectId: string) => {
      router.push({ name: 'Preview', query: { projectId } });
    };
    const onPublish = () => {
      // 发布逻辑
      proxy.$message.info(`发布功能紧急研发中...`);
    }
    
    const deleteProject = (id: string) => {
      proxy.$confirm('确定要删除这个项目吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const updatedProjects = projects.value.filter(p => p.id !== id);
        projects.value = updatedProjects;

        localStorage.setItem('projects', JSON.stringify(updatedProjects));
        proxy.$message.success('删除成功');
      }).catch(() => {
        proxy.$message.info('已取消删除');
      });
    }
    
    onMounted(() => {
      // 从本地存储加载项目列表
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        try {
          const parsedProjects = JSON.parse(savedProjects);
          // 确保项目数据包含必要字段
          projects.value = parsedProjects.map((project: any) => ({
            id: project.id || Date.now().toString(),
            name: project.name || config.projectName,
            updatedAt: project.updatedAt || new Date().toISOString(),
            viewType: project.viewType || config.defaultView,
            components: project.components || [],
            selectedComponent: project.selectedComponent || null,
            canvasStyle: project.canvasStyle || null
          }));
        } catch (e) {
          console.error('解析项目数据失败:', e);
        }
      }
    });
    
    const renameProject = (id: string) => {
      proxy.$message.info(`重命名功能紧急研发中...`);
    };

    const duplicateProject = (id: string) => {
      const project = projects.value.find(p => p.id === id);
      if (project) {
        const newProject = {
          ...project,
          id: Date.now().toString(),
          name: `${project.name} (副本)`,
          updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
        projects.value = [...projects.value, newProject];
        localStorage.setItem('projects', JSON.stringify(projects.value));
        proxy.$message.success('创建副本成功');
      }
    };

    return {
      createPC,
      createMobile,
      projects,
      editProject,
      config,
      onPreview,
      onPublish,
      deleteProject,
      renameProject,
      duplicateProject
    };
  }
});
</script>

<style lang="less" scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  min-height: 100vh;
}

.project-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 20px 0;
  margin-top: 60px;
}

.project-card {
  position: relative;
  transition: all 0.3s;
  border-radius: 8px;

  &:hover{
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
}

.project-content{
  position: relative;
}

.project-info {
  margin-bottom: 24px;

  h3 {
    margin-bottom: 8px;
  }
  p {
    margin-bottom: 8px;
    font-size: 14px;
  }

  .project-status {
    margin-left: 10px;
  }
}

.empty-message {
  text-align: center;
  color: #909399;
  font-size: 14px;
  margin-top: 180px;
  padding: 20px;
}

.project-actions {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 10px;
}

.more-actions-dropdown {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}

.entry-buttons {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.entry-button {
  padding: 26px 30px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}
</style>