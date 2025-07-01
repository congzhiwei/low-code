<template>
  <main 
    class="canvas-container" 
    @click="handleCanvasClick"
  >
   
        <div class="canvas" ref="canvas" 
            @drop="handleDrop" 
            @dragover="handleDragOver"
            :style="canvasStyle">
            <template v-if="components.length > 0">
              <DraggableContainer referenceLineColor="#409eff">
                <Vue3DraggableResizable 
                  v-for="(component, index) in components" 
                  :key="index"
                  :parent="true"
                  :x="component.x"
                  :y="component.y"
                  :style="{width: component.styles.width+2+'px', height: component.styles.height+2+'px'}"
                  @dragging="startDrag(index, $event)"
                  @resizing="onResize(index, $event)"
                  >
                  <component 
                      class="component-wrapper"
                      :is="component.type"
                      :style="{ ...componentStyles[index] }"
                      v-bind="component.props"
                      v-model="componentDefaultValues[index]"
                      @click="selectComponent(index)"
                      @update:props="updateProps"
                      @update:styles="updateStyles"
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
                </Vue3DraggableResizable>
              </DraggableContainer>
            </template>
            <div v-else class="tips">请拖动左侧组件到此</div>
        </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useCanvasStore } from '../../stores/canvas';
import Vue3DraggableResizable, { DraggableContainer } from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

export default defineComponent({
  name: 'Canvas',
  components: {
    Vue3DraggableResizable, DraggableContainer
  },
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

    const option =  ref({
        title: {
            text: 'Bar Chart',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'horizontal',
            align: 'left',
            data: ['数据1', '数据2', '数据3']
        },
        xAxis: { // 新增 xAxis 配置
            type: 'value'
        },
        yAxis: { // 新增 yAxis 配置（数值轴）
            type: 'category',
            data: ['类别1', '类别2', '类别3'] // 定义 x 轴类目（与 series.data 长度一致）
        },
        series: [
            {
                name: '数据',
                type: 'bar',
                data: [10, 20, 30]
            }
        ]
      })

    

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
      // e.stopPropagation()
      // const component = {...props.components[index]}
      // const startX = e.x
      // const startY = e.y
      // const startLeft = startX
      // const startTop = startY

      props.components[index].x = e.x
      props.components[index].y = e.y
      
      // const onMouseMove = (moveEvent: MouseEvent) => {
      //   const dx = moveEvent.clientX - startX
      //   const dy = moveEvent.clientY - startY
      //   props.components[index].x = startLeft + dx
      //   props.components[index].y = startTop + dy
      // }
      
      // const onMouseUp = () => {
      //   document.removeEventListener('mousemove', onMouseMove)
      //   document.removeEventListener('mouseup', onMouseUp)
        
      //   // 检查组件是否超出画布底部
      //   const rect = canvas.value!.getBoundingClientRect();
      //   const component = props.components[index];
      //   const componentHeight = component.styles?.height ? parseInt(component.styles.height) : 0;
      //   const componentBottom = component.y + componentHeight;
      //   const currentHeight = parseInt(canvasStyle.value.height);
      //   console.log('component', component)
      //   if (componentBottom > currentHeight - 50) {
      //     // 根据组件底部位置计算新高度，增加100px缓冲空间
      //     canvasStyle.value = {
      //       ...canvasStyle.value,
      //       height: `${componentBottom + 100}px`
      //     };
      //   }
      // }
      
      // document.addEventListener('mousemove', onMouseMove)
      // document.addEventListener('mouseup', onMouseUp)
    }

    const onResize = (index: number, resizing: any) => {
      // 处理调整大小时的吸附逻辑
      // console.log(`Size: ${x},${y},${width}x${height}`)
      const { x, y, w, h } = resizing;
      // 设置宽度和高度
      const component = props.components[index];
      component.styles.width = w
      component.styles.height = h

    }
    
    const updateProps = (index: number, newProps: Record<string, any>) => {
      console.log('updateProps', index, newProps)
      const currentProps = props.components[index].props;
      const mergedProps = {...currentProps, ...newProps};
      canvasStore.updateComponentProps(index, mergedProps);
      emit('update:props', mergedProps);
    };

    const updateStyles = (newStyles: Record<string, any>) => {
      const index = canvasStore.selectedComponentIndex;
      if(index !== -1){
        console.log('updateStyles', index, newStyles)
        const currentStyles = props.components[index].styles;
        const mergedStyles = {...currentStyles,...newStyles};
        canvasStore.updateComponentStyles(index, mergedStyles);
      }
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

    const handleCanvasClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target?.closest('.component-wrapper') && !target.closest('.vdr-container')) {
        canvasStore.selectedComponent = null;
        canvasStore.selectedComponentIndex = -1;
      }
    }

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
      updateStyles,
      canvasStyle,
      componentDefaultValues,
      componentStyles,
      handleCanvasClick,
      option,
      onResize
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
.tips {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 12px;
  transform: translate(-50%, -50%);
}
</style>
