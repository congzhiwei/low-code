<template>
  <main class="canvas-container">
    <div class="canvas" ref="canvas" 
        @drop="handleDrop" 
        @dragover="handleDragOver"
        :style="canvasStyle">
        <component 
            v-for="(component, index) in components" 
            :key="index"
            :is="component.type"
            :style="{ position: 'absolute', left: component.x + 'px', top: component.y + 'px', ...componentStyles[index] }"
            v-bind="component.props"
            v-model="componentDefaultValues[index]"
            @mousedown="startDrag(index, $event)"
            @click="selectComponent(index)"
            @update:props="updateProps">
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
                    @click="updateProps(index, {options: {...component.props.options, default: option.value}})"
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
                v-for="(column, i) in component.props.columns?.columns"
                :key="i"
                :prop="column.prop"
                :label="column.label"
              />
            </template> 
        </component>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useCanvasStore } from '../stores/canvas';

export default defineComponent({
  name: 'Canvas',
  props: {
    components: {
      type: Array as () => Array<{
        type: string;
        x: number;
        y: number;
        // width: number;
        props: Record<string, any>;
        styles: Record<string, any>;
        events?: Record<string, any>;
      }>,
      required: true
    },
    currentView: {
      type: String as () => 'pc' | 'mobile',
      required: true
    }
  },
  // emits: ['drop', 'dragover', 'update:props'],
  emits: ['dragover', 'update:props'],
  setup(props, { emit }) {
    const canvasStyle = computed({
      get: () => {
        if (props.currentView === 'mobile') {
          const { width, height, ...rest } = canvasStore.canvasStyle;
          return { width: '375px', height: '667px', ...rest };
        }
        console.log('canvasStyle', canvasStore.canvasStyle)
        return canvasStore.canvasStyle;
      },
      set: (value) => {
        canvasStore.canvasStyle = value;
      }
    });

    

    const canvasStore = useCanvasStore();
    const canvas = ref<HTMLElement | null>(null);
    
    const handleDrop = (e: DragEvent) => {
      canvasStore.handleDrop(e, canvas.value!);
    };
    
    const handleDragOver = (e: DragEvent) => {
      canvasStore.handleDragOver(e);
      emit('dragover', e);
    };
    
    const startDrag = (index: number, e: MouseEvent) => {
      e.stopPropagation()
      const component = {...props.components[index]}
      const startX = e.clientX
      const startY = e.clientY
      const startLeft = component.x
      const startTop = component.y
      
      const onMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        props.components[index].x = startLeft + dx
        props.components[index].y = startTop + dy
      }
      
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        
        // 检查组件是否超出画布底部
        const rect = canvas.value!.getBoundingClientRect();
        const component = props.components[index];
        const componentHeight = component.styles?.height ? parseInt(component.styles.height) : 0;
        const componentBottom = component.y + componentHeight;
        const currentHeight = parseInt(canvasStyle.value.height);
        console.log('component', component)
        if (componentBottom > currentHeight - 50) {
          // 根据组件底部位置计算新高度，增加100px缓冲空间
          canvasStyle.value = {
            ...canvasStyle.value,
            height: `${componentBottom + 100}px`
          };
        }
      }
      
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
    
    const updateProps = (index: number, newProps: Record<string, any>) => {
      console.log('updateProps', index, newProps)
      const currentProps = props.components[index].props;
      const mergedProps = {...currentProps, ...newProps};
      canvasStore.updateComponentProps(index, mergedProps);
      emit('update:props', mergedProps);
    };
    
    const selectComponent = (index: number) => {
      canvasStore.selectComponent(index)
      canvasStore.selectedComponentIndex = index
    }
    
    // const deleteComponent = (index: number) => {
    //   canvasStore.deleteComponent(index)
    // }
    
    const componentStyles = computed(() => {
      return props.components.map(component => {
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
      // todo 处理默认值
      return props.components.map(component => {
        if (component.type === 'el-select' || component.type === 'van-picker') {
          return component.props.options?.default ?? ''
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
          return component.props.default ?? false
        } else if (component.type === 'el-image') {
          return component.props.src ?? ''
        }
        return ''
      })
    })

    // const handleKeyDown = (e: KeyboardEvent) => {
    //   console.log(e.key, e.target);
    //   if ((e.key === 'Delete' || e.key === 'Backspace') && 
    //       canvasStore.selectedComponentIndex !== -1 &&
    //       canvas.value && canvas.value.contains(e.target as Node)) {
    //     deleteComponent(canvasStore.selectedComponentIndex);
    //   }
    // };

    // onMounted(() => {
    //   window.addEventListener('keydown', handleKeyDown);
    // });

    // onUnmounted(() => {
    //   window.removeEventListener('keydown', handleKeyDown);
    // });

    return {
      canvas,
      handleDrop,
      handleDragOver,
      canvasStore,
      startDrag,
      selectComponent,
      // deleteComponent,
      updateProps,
      canvasStyle,
      componentDefaultValues,
      componentStyles,
    };
  }
});
</script>

<style lang="less" scoped>
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
  position: relative;
  user-select: none;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
}
</style>