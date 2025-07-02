<!--
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-05-06 17:40:47
 * @LastEditors: zwcong
 * @LastEditTime: 2025-07-02 16:52:59
-->
<template>
  <div>
    <template v-for="(value, key) in propsConfig" :key="key">
      <div class="sub-panel" v-if="getConfigType(key)">
        <label class="sub-panel-title">{{ getConfigName(key) }}</label>
        <template v-if="getConfigType(key) === 'radio'">
          <el-radio-group v-model="propsConfig[key]" @change="$emit('update')" size="small">
            <el-radio-button 
              v-for="option in canvasStore.componentConfigs[componentType]?.[configType][key]?.options" 
              :key="option" 
              :label="option">
              {{ option }}
            </el-radio-button>
          </el-radio-group>
        </template>
        <template v-else-if="getConfigType(key) === 'checkbox'">
          <el-checkbox v-model="propsConfig[key]" @change="$emit('update')" size="small" />
        </template>
        <template v-else-if="getConfigType(key) === 'switch'">
          <el-switch v-model="propsConfig[key]" @change="$emit('update')" size="small" />
        </template>
        <template v-else-if="getConfigType(key) === 'select-options'">
          <div>
            <el-select v-model="propsConfig[key].type" @change="handleSelectChange(key)" size="small">
              <el-option 
                v-for="option in canvasStore.componentConfigs[componentType]?.[configType][key]?.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <SelectOptionsConfig 
              :prop-value="propsConfig[key]" 
              :api-list="apiList"
              @update:prop-value="(val: any) => { propsConfig[key] = val; $emit('update'); }"
              @show-api-dialog="$emit('show-api-dialog')"
            />
          </div>
        </template>
        <template v-else-if="getConfigType(key) === 'color'">
          <el-color-picker v-model="propsConfig[key]" @change="$emit('update')" size="small" show-alpha />
        </template>
        <template v-else-if="getConfigType(key) === 'upload'">
          <el-upload
            class="upload-box"
            action=""
            :auto-upload="false"
            :show-file-list="false"
            :on-change="(file) => handleImageUpload(key, file)"
          >
            <div class="upload-content">
              <el-icon v-if="!propsConfig[key]" class="upload-icon"><Plus /></el-icon>
              <img v-else :src="propsConfig[key]" class="upload-preview" />
            </div>
          </el-upload>
        </template>
        <template v-else-if="getConfigType(key) === 'input-select'">
          <el-input 
            v-model="propsConfig[key]" 
            :placeholder="getConfigPlaceholder(key)" 
            clearable 
            @input="$emit('update')" 
            @change="$emit('update')" 
            size="small"
          >
            <template #append>
              <el-select 
                v-model="propsConfig[getConfigKey(key)]" 
                @change="$emit('update')" 
                size="small" 
                style="width: 48px"
                placeholder=""
              >
                <el-option 
                  v-for="option in canvasStore.componentConfigs[componentType]?.[configType][key]?.options" 
                  :key="option" 
                  :label="option" 
                  :value="option"
                />
              </el-select>
            </template>
          </el-input>
        </template>
        <template v-else-if="getConfigType(key) === 'input'">
          <el-input v-model="propsConfig[key]" :placeholder="getConfigPlaceholder(key)" clearable @input="$emit('update')" @change="$emit('update')" size="small" />
        </template>
        <template v-else-if="getConfigType(key) === 'css'">
          <div class="css-config">
            <div v-for="(cssProp, cssKey) in canvasStore.componentConfigs[componentType]?.[configType][key]?.values" :key="cssKey" class="css-item">
              <span class="css-label">{{ cssProp.name }}：</span>
              <template v-if="cssProp.type === 'color'">
                <el-color-picker 
                  v-model="propsConfig[key][cssProp.key]" 
                  @change="$emit('update')" 
                  size="small" 
                  show-alpha
                />
              </template>
            </div>
          </div>
        </template>
        <template v-else-if="getConfigType(key) === 'columns'">
          <el-select v-model="propsConfig[key].type" @change="handleSelectChange(key, false)" size="small">
            <el-option 
              v-for="option in canvasStore.componentConfigs[componentType]?.[configType][key]?.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <ColumnsConfig 
            :prop-value="propsConfig[key]" 
            :data="propsConfig.data"
            :api-list="apiList"
            @update:prop-value="(val: any) => { propsConfig[key] = val; $emit('update'); }"
            @update:data="(val: any) => { 
              console.log('update data', val);
              propsConfig.data = cloneDeep(val); 
              $emit('update'); 
            }"
            @update:visible="(val: boolean) => { propsConfig[key].visible = val; $emit('update'); }"
            @show-api-dialog="$emit('show-api-dialog')"
          />
        </template>
        <template v-else-if="getConfigType(key) === 'row'">
          <div>
            <div class="flex mb-5" v-if="propsConfig.columns.type==='related'">
              <el-checkbox 
              v-model="propsConfig.columns.useEditData" 
              size="small" 
              @change="(val: any) => {
                onUseEditDataChange(val, key);
              }" />
              <span class="sub-panel-title mb-0">使用自定义数据</span>
            </div>
            <RowConfig
              v-if="propsConfig.columns.useEditData"
              :prop-value="propsConfig[key]"
              :columns="propsConfig.columns.columns"
              :rowTitles="propsConfig.rowTitles"
              :showAddRow="propsConfig.showAddRow"
              @update:prop-value="(val: any) => { propsConfig[key] = val; $emit('update'); }"
            />
          </div>
        </template>
        <template v-else-if="getConfigType(key) === 'slider'">
          <div class="slider-flex">
            <el-slider
              v-model="propsConfig[key]"
              @change="$emit('update')"
              size="small"
            />
            <div class="slider-value">{{ propsConfig[key] }}%</div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCanvasStore } from '../../stores/canvas';
import SelectOptionsConfig from './SelectOptionsConfig.vue';
import RowConfig from './RowConfig.vue';
import ColumnsConfig from './ColumnsConfig.vue';
import type { UploadFile } from 'element-plus';
import { cloneDeep } from 'lodash'

export default defineComponent({
  name: 'PropsConfig',
  components: {
    SelectOptionsConfig,
    RowConfig,
    ColumnsConfig
  },
  props: {
    propsConfig: {
      type: Object,
      required: true
    },
    componentType: {
      type: String,
      required: true
    },
    configType: {
      type: String,
      default: 'props'
    },
    apiList: {
      type: Array as () => {name: string; url: string}[],
      default: () => []
    }
  },
  emits: ['update', 'show-api-dialog'],
  setup(props, { emit }) {
    const canvasStore = useCanvasStore();
    
    const getConfigType = (configKey: string) => {
      // console.log('configKey',props.componentType, props.configType, canvasStore.componentConfigs[props.componentType]?.[props.configType]?.[configKey]?.type)
      return canvasStore.componentConfigs[props.componentType]?.[props.configType]?.[configKey]?.type;
    };
    const getConfigName = (configKey: string) => {
      // console.log('configKey',props.componentType, props.configType, canvasStore.componentConfigs[props.componentType]?.[props.configType]?.[configKey]?.name)
      return canvasStore.componentConfigs[props.componentType]?.[props.configType]?.[configKey]?.name;
    };

    const getConfigKey = (configKey: string) => {
      return canvasStore.componentConfigs[props.componentType]?.[props.configType]?.[configKey]?.key;
    }

    // const getConfigBtn = (configKey: string) => {
    //   return canvasStore.componentConfigs[props.componentType]?.[props.configType]?.[configKey]?.btn;
    // }
    const getConfigPlaceholder = (configKey: string) => {
      return canvasStore.componentConfigs[props.componentType]?.[props.configType]?.[configKey]?.placeholder;
    }
    const handleImageUpload = (key: string, file: UploadFile) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        props.propsConfig[key] = e.target?.result as string;
        emit('update');
      };
      reader.readAsDataURL(file.raw as File);
    };

    const showTableDataDialog = (key: string) => {
      if (!props.propsConfig[key]) {
        props.propsConfig[key] = {};
      }
      props.propsConfig[key].visible = true;
      emit('update');
    };
    const showTableColumnsDialog = (key: string) => {
      if (!props.propsConfig[key]) {
        props.propsConfig[key] = { columns: [] };
      }
      props.propsConfig[key].visible = true;
      emit('update');
    };

    const onUseEditDataChange = (val:any, key:string) => {
      props.propsConfig.data = cloneDeep(val ? props.propsConfig[key] : props.propsConfig.columns.apiData)
      emit('update');
    }

    return { 
      canvasStore, 
      getConfigType, 
      getConfigName, 
      getConfigKey, 
      getConfigPlaceholder, 
      handleImageUpload,
      showTableDataDialog,
      showTableColumnsDialog,
      cloneDeep,
      onUseEditDataChange
    };
  },
  methods: {
    //isUseKey 是否使用key，就是把key放在propsConfig[key]里面，还是放在propsConfig[key].type里面
    handleSelectChange(key: string, isUseKey: boolean = true) {
      // if (isUseKey) {
      //   this.propsConfig[key] = { type: this.propsConfig[key].type };
      // }else{
      //   this.propsConfig.type = this.propsConfig.type
      // }

      // this.propsConfig[key] = { type: this.propsConfig[key].type };
      // console.log('this.propsConfig[key]', this.propsConfig, this.propsConfig[key])
      // this.$emit('update');
    },

  }
});
</script>

<style lang="less" scoped>
.sub-panel {
  margin-bottom: 10px;
}
.sub-panel-title {
  display: block;
  margin-bottom: 5px;
  font-size: 12px;
  color: #606266;
}
.mb-0{
  margin-bottom: 0;
}
.mb-5{
  margin-bottom: 5px;
}
.el-radio-group {
  display: flex;
}
.flex{
  display: flex;
  gap: 5px;
  align-items: center;
}

.upload-box {
  :deep(.el-upload) {
    width: 100px;
    height: 100px;
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      border-color: #409eff;
    }
  }
}

.upload-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-icon {
  font-size: 24px;
  color: #8c939d;
}

.upload-preview {
  max-width: 100%;
  max-height: 100%;
}

.css-config {
  margin-left: 20px;
  display: flex;
  justify-content:space-around;
  .css-item {
    display: flex;
    align-items: center;
    
    .css-label {
      font-size: 12px;
    }
  }
}
.slider-flex{
  display: flex;
  padding: 0 20px;
  font-size: 12px;
  align-items: center;
  justify-content: space-between;

  .el-slider{
    margin-right: 20px;
  }
  .slider-value{
    width: 32px;
    flex: none;
  }
}
</style>