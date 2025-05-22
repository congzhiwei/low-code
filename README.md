# 低代码平台项目文档

## 一、项目概述
可视化低代码开发平台，支持通过拖拽组件快速构建PC端和移动端页面。功能包括：
- 组件库管理（通用组件拖拽）
- 可视化画布设计（实时布局调整）
- 项目全生命周期管理（创建/编辑/预览/删除）
- 组件属性动态配置（样式/交互参数设置）

## 二、技术栈清单
| 分类       | 技术/工具               | 版本       | 说明                  |
|------------|-------------------------|------------|-----------------------|
| 前端框架   | Vue.js                  | 3.4.0      | 核心视图层框架        |
| 状态管理   | Pinia                   | 2.1.7      | Vue3官方状态管理方案  |
| 路由管理   | Vue Router              | 4.5.0      | 页面路由控制          |
| UI组件库   | Element Plus            | 2.7.6      | PC端组件库            |
|            | Vant                    | 4.8.5      | 移动端组件库          |
| 工具库     | Day.js                  | 1.11.13    | 时间处理              |
|            | Axios                   | 1.9.0      | HTTP请求              |
| 构建工具   | Vite                    | 5.1.0      | 快速构建工具          |
| 类型检查   | TypeScript              | 5.3.3      | 类型安全支持          |

## 三、目录结构
```
low-code-new/
├── public/                 # 静态资源
│   ├── libs/               # 第三方库
│   └── reset.css           # 样式重置
├── src/                    # 核心源码
│   ├── api/                # API请求封装
│   ├── components/         # 公共组件
│   │   ├── Canvas.vue      # 画布核心组件
│   │   ├── ComponentLibrary.vue # 组件库面板
│   │   └── PropertyPanel.vue    # 属性配置面板
│   ├── views/              # 页面视图
│   │   ├── Dashboard.vue   # 工作台页面
│   │   ├── Design.vue      # 设计器页面
│   │   └── Preview.vue     # 预览页面
│   ├── stores/             # 状态管理
│   │   └── canvas.ts       # 画布状态（组件/选中项等）
│   ├── data/               # 示例数据
│   ├── customComponents/   # 自定义组件
│   ├── router.ts           # 路由配置
│   ├── ui-config.ts        # UI组件全局注册配置
│   └── main.ts             # 应用入口
├── .gitignore              # Git忽略规则
├── package.json            # 依赖管理
└── tsconfig.json           # TypeScript配置
```

## 四、核心功能说明

### 1. 组件库系统（ComponentLibrary.vue）
- 支持PC/移动端组件分类展示（通过`currentView`状态控制）
- 内置通用组件：文本、按钮、输入框、选择器、复选框等（Element Plus + Vant组件）
- 组件可拖拽：通过`draggable`属性和`@dragstart`事件实现组件拖拽到画布

### 2. 画布设计器（Design.vue）
- 三栏布局：组件库面板（左）、画布区域（中）、属性面板（右）
- 组件状态管理：使用 Pinia 的 `canvasStore` 存储当前画布组件列表、选中组件等状态（核心逻辑定义在 `src/stores/canvas.ts`）
- 数据持久化：通过 `localStorage` 保存项目数据（`saveCanvas` 方法实现）
- 多端适配：支持 `pc`/`mobile` 视图类型切换（通过 `currentView` 状态控制）

### 2.1 画布状态管理核心文件（canvas.ts）
`src/stores/canvas.ts` 是画布状态管理的核心文件，通过 Pinia 实现全局状态共享，主要包含以下关键配置项和方法：

#### 核心配置项（State）
| 配置项           | 类型                          | 说明                                                                 |
|------------------|-------------------------------|----------------------------------------------------------------------|
| `components`     | `Component[]`                 | 存储当前画布中所有组件的元数据（类型、位置、样式、属性等）           |
| `selectedComponentIndex` | `number`             | 当前选中组件的索引（-1 表示未选中）                                 |
| `currentView`    | `'pc' | 'mobile'`             | 当前画布视图类型（控制移动端/PC端布局适配）                          |
| `projectName`    | `string`                      | 当前项目名称（用于保存和展示）                                       |
| `canvasStyle`    | `CanvasStyle`（自定义类型）   | 画布全局样式（如宽度、高度、背景色等，示例：`{ width: '1200px', height: '800px', backgroundColor: '#f5f5f5' }`） |

#### 核心配置对象（Config）
除状态外，`canvas.ts` 还包含以下核心配置对象，用于定义组件的默认属性、样式和可配置参数：

| 配置对象          | 类型                          | 说明                                                                 |
|-------------------|-------------------------------|----------------------------------------------------------------------|
| `defaultWidths`   | `Record<string, any>`         | 定义各组件的默认宽度值，部分组件支持动态适配（如 `QuestionRenderer` 根据 `pc/mobile` 视图返回不同宽度）<br>**示例**：`'el-input': 200`（固定宽度），`'QuestionRenderer': (viewType) => viewType === 'pc' ? 400 : 365`（动态宽度） |
| `componentConfigs`| `Record<string, { props: any; styles: any }>` | 定义每个组件的可配置属性（`props`）和样式（`styles`），包含类型（输入框/单选框/颜色选择器等）、选项（`options`）和显示名称（`name`）<br>**示例**：`'el-button'` 包含 `type`（按钮类型，单选）、`plain`（是否朴素按钮，开关）等属性，样式包含 `width`（宽度）、`color`（文本颜色）等 |
| `defaultProps`    | `Record<string, Record<string, any>>` | 各组件的默认属性值，用于新组件创建时的初始状态<br>**示例**：`'el-button'` 默认属性为 `{ placeholder: '按钮', type: 'primary' }` |
| `defaultStyles`   | `Record<string, Record<string, any>>` | 各组件的默认样式值，包含尺寸（`width`/`height`）、颜色等基础样式属性<br>**示例**：`'el-button'` 默认样式为 `{ width: '', height: '', color: '' }` |

#### 核心方法（Actions）
| 方法名                  | 参数说明                                                                 | 功能描述                                                                 |
|-------------------------|--------------------------------------------------------------------------|--------------------------------------------------------------------------|
| `handleDrop`            | `DragEvent`, `HTMLElement`（画布DOM节点）                               | 处理组件拖拽到画布的逻辑，计算组件位置并添加到 `components` 列表        |
| `updateComponentProps`  | `index: number`, `newProps: Record<string, any>`                         | 更新指定索引组件的属性（如按钮文本、输入框占位符等），触发视图同步更新  |
| `selectComponent`       | `index: number`                                                          | 选中指定索引的组件，更新 `selectedComponentIndex` 状态（用于属性面板联动） |
| `saveCanvas`            | 无                                                                       | 将当前画布状态（`components`、`projectName` 等）持久化到 `localStorage` |
| `loadProject`           | `projectId: string`                                                      | 根据项目ID从 `localStorage` 加载历史项目数据，初始化画布状态            |

### 3. 项目管理（Dashboard.vue）
- 项目列表展示：显示项目名称、最后修改时间、视图类型（PC/移动端）
- 基础操作：编辑项目、预览项目、删除项目、创建副本（`duplicateProject`方法）
- 空状态处理：无项目时显示"暂无项目，请创建一个新的项目"提示

### 4. 预览功能（Preview.vue）
- 项目加载：通过路由参数`projectId`获取本地存储的项目数据
- 组件渲染：根据`component.type`动态渲染不同类型组件（支持el-select、el-checkbox等）
- 样式处理：将数值类型样式属性转换为带单位的字符串（如`width: 100px`）

## 五、快速开始

### 1. 环境准备
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0 或 yarn ≥ 1.22.0

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```
访问`http://localhost:3000`进入工作台页面

### 4. 创建项目
- 点击"创建PC端"或"创建移动端"按钮进入设计器
- 从左侧组件库拖拽需要的组件到中间画布区域
- 通过右侧属性面板调整组件样式/交互参数
- 点击顶部"保存"按钮存储项目到本地

## 六、扩展说明

### 1. 新增组件
1. 在`ui-config.ts`的`elementPlusComponents`或`vantComponents`中添加新组件
2. 在`ComponentLibrary.vue`的组件网格中添加对应的`component-item`元素
3. 为新组件添加属性配置逻辑（在`PropertyPanel.vue`中增加对应类型处理）

### 2. 数据存储扩展
当前使用`localStorage`存储项目数据，如需扩展为服务端存储：
- 修改`src/stores/canvas.ts`中的数据持久化逻辑
- 在`src/api/request.ts`中添加项目数据接口（参考`config.ts`中的API配置）
- 更新`Dashboard.vue`和`Design.vue`中的`saveCanvas`/`loadProject`方法
- 
## 七、使用说明

### 1. 新增组件完整流程
添加一个新组件需完成以下步骤（以自定义组件 `NewComponent` 为例）：

#### 1. 注册组件（`ui-config.ts`）
在 `src/ui-config.ts` 的 `customComponents` 中注册新组件（若为 Element Plus/Vant 组件，则在对应 `elementPlusComponents`/`vantComponents` 中注册）：
```typescript
// src/ui-config.ts
export const customComponents = {
  QuestionRenderer,
  NewComponent // 新增组件
}
#### Trae

思考过程

### 在 README.md 中补充配置说明及新增组件指南
以下是需要添加到 README.md 中的内容，主要介绍 defaultWidths 、 componentConfigs 、 defaultProps 、 defaultStyles 四个核心配置项，并补充新增组件的完整流程：

## 四、核心功能说明（补充）
### 2.2 核心配置项说明
低代码平台通过以下配置项管理组件的默认属性、样式和可配置参数：
 1. defaultWidths （位于 src/stores/canvas.ts ）
定义各组件的默认宽度值，部分组件支持根据视图类型（PC/移动端）动态调整宽度。 示例 ：

```
const defaultWidths: Record<string, any> = {
  'el-input': 200, // el-input 组件默认宽度 200px
  'el-table': 400, // el-table 组件默认宽度 400px
  'QuestionRenderer': (viewType: 'pc' | 'mobile') => 
  viewType === 'pc' ? 400 : 365 // 动态宽度（PC 400px，移动
  端 365px）
} as const
``` 2. componentConfigs （位于 src/stores/canvas.ts ）
核心组件配置对象，定义每个组件的可配置属性（ props ）和样式（ styles ），包括类型（输入框/单选框/颜色选择器等）、选项（ options ）和显示名称（ name ）。 示例（以 el-button 为例） ：

```
const componentConfigs: Record<string, any> = {
  'el-button': {
    props: {
      type: { name: '按钮类型', type: 'radio', options: 
      ['primary', 'success', 'warning', 'danger', 
      'info'] }, // 单选类型属性
      placeholder: { name: '按钮文本', type: 'input' }, // 
      输入框类型属性
      plain: { name: '是否朴素按钮', type: 'switch' } // 开
      关类型属性
    },
    styles: {
      ...sizeStyles, // 继承尺寸样式（宽度/高度）
      color: { name: '文本颜色', type: 'color' } // 颜色选择
      器类型样式
    }
  }
} as const
``` 3. defaultProps （位于 src/stores/canvas.ts ）
各组件的默认属性值，用于新组件创建时的初始状态。 示例 ：

```
const defaultProps: Record<string, Record<string, any>> = 
{
  'el-button': { placeholder: '按钮', type: 'primary', 
  size: 'default' }, // el-button 默认属性
  'QuestionRenderer': { questionIds: 
  '5429b0311d5541d198357282fd4d70cf', hideDifficulty: 
  false } // 自定义组件默认属性
} as const
``` 4. defaultStyles （位于 src/stores/canvas.ts ）
各组件的默认样式值，包含尺寸（ width / height ）、颜色等基础样式属性。 示例 ：

```
const defaultStyles: Record<string, Record<string, any>> 
= {
  'el-button': { width: '', height: '', widthUnit: 'px', 
  heightUnit: 'px', color: '' }, // el-button 默认样式
  'QuestionRenderer': { width: '', height: '', color: '', 
  backgroundColor: 'transparent' } // 自定义组件默认样式
} as const
```
## 六、扩展说明（补充）
### 1. 新增组件完整流程
添加一个新组件需完成以下步骤（以自定义组件 NewComponent 为例）：
 1.1 注册组件（ ui-config.ts ）
在 src/ui-config.ts 的 customComponents 中注册新组件（若为 Element Plus/Vant 组件，则在对应 elementPlusComponents / vantComponents 中注册）：

```
// src/ui-config.ts
export const customComponents = {
  QuestionRenderer,
  NewComponent // 新增组件
}
``` 1.2 配置默认宽度（ canvas.ts ）
在 defaultWidths 中添加新组件的默认宽度（可选，根据需要配置）：

```
// src/stores/canvas.ts
const defaultWidths: Record<string, any> = {
  // ...其他组件
  'NewComponent': 300 // 新组件默认宽度 300px
} as const
``` 1.3 定义可配置属性和样式（ canvas.ts ）
在 componentConfigs 中定义新组件的可配置属性（ props ）和样式（ styles ）：

```
// src/stores/canvas.ts
const componentConfigs: Record<string, any> = {
  // ...其他组件配置
  'NewComponent': {
    props: {
      title: { name: '标题', type: 'input', placeholder: '
      请输入标题' }, // 输入框属性
      isHighlight: { name: '高亮显示', type: 'switch' } // 
      开关属性
    },
    styles: {
      ...sizeStyles, // 继承尺寸样式（宽度/高度）
      backgroundColor: { name: '背景颜色', type: 
      'color' } // 颜色样式
    }
  }
} as const
``` 1.4 配置默认属性和样式（ canvas.ts ）
在 defaultProps 和 defaultStyles 中添加新组件的默认值：

```
// src/stores/canvas.ts
const defaultProps: Record<string, Record<string, any>> = 
{
  // ...其他组件
  'NewComponent': { title: '新组件', isHighlight: 
  false } // 默认属性
} as const

const defaultStyles: Record<string, Record<string, any>> 
= {
  // ...其他组件
  'NewComponent': { width: 300, height: 100, widthUnit: 
  'px', heightUnit: 'px', backgroundColor: '#fff' } // 默
  认样式
} as const
``` 1.5 添加组件库展示（ ComponentLibrary.vue ）
在组件库面板（ src/components/ComponentLibrary.vue ）的网格中添加新组件的展示项，确保用户可从左侧组件库拖拽使用。
 1.6 适配属性面板（ PropertyPanel.vue ）
若新组件需要特殊属性配置逻辑（如复杂交互），需在属性面板（ src/components/PropertyPanel.vue ）中添加对应类型的处理逻辑。

完成以上步骤后，新组件即可在设计器中使用，并支持通过属性面板配置其属性和样式。

我

复制

删除

修改readme.md   介绍defaultWidths、componentConfigs、defaultProps、defaultStyles，说明，如果添加一个新组件怎样添加

Trae

思考过程

Workspace

README.md 80-80

canvas.ts 1-415

README.md 2-10

README.md 52-58

README.md 11-24

... 更多 ( 20 +)

好的，我现在需要处理用户的请求，用户希望修改README.md，介绍defaultWidths、componentConfigs、defaultProps、defaultStyles，并说明如何添加新组件。首先，我需要查看用户提供的README.md内容，找到需要插入的位置。

首先，用户当前的README.md结构中，“四、核心功能说明”下有“2.1 画布状态管理核心文件（canvas.ts）”部分，其中已经介绍了核心配置项（State）和核心方法（Actions）。用户需要补充的defaultWidths等配置项属于canvas.ts中的核心配置，应该在这一部分下新增一个子节，比如“核心配置项（Config）”。

接下来，用户需要介绍四个配置项：defaultWidths、componentConfigs、defaultProps、defaultStyles。需要从提供的canvas.ts内容中提取这些配置的定义和作用。例如，defaultWidths定义了各组件的默认宽度，componentConfigs定义了组件的可配置属性和样式，defaultProps是默认属性值，defaultStyles是默认样式值。

然后，用户还需要说明如何添加新组件。当前README的“六、扩展说明”下有“1. 新增组件”部分，但内容较简略，需要根据canvas.ts中的配置项补充详细步骤，包括在defaultWidths、componentConfigs、defaultProps、defaultStyles中添加新组件的配置，以及注册组件等步骤。

现在需要将这些内容整合到README.md中，确保结构清晰，说明详细。需要注意使用用户提供的代码示例，比如从canvas.ts中引用defaultWidths的示例，componentConfigs的结构等。同时，添加新组件的步骤需要具体，指导用户如何修改各个配置项。

最后，检查是否符合用户的要求，确保所有需要介绍的配置项都被覆盖，新增组件的步骤详细且可操作。同时，保持与现有README结构的一致性，使用相同的标题层级和格式。

### 修改说明：在 README.md 中补充 canvas.ts 核心配置项说明及新增组件详细流程
以下是针对 /Users/congzhiwei/Documents/my/project/low-code-new/README.md 的修改内容，主要在「四、核心功能说明/2.1 画布状态管理核心文件（canvas.ts）」下补充配置项说明，并优化「六、扩展说明/1. 新增组件」的详细步骤：

```
# 低代码平台项目文档

## 四、核心功能说明

### 2.1 画布状态管理核心文件（canvas.ts）
`src/stores/canvas.ts` 是画布状态管理的核心文件，通过 Pinia 实
现全局状态共享，主要包含以下关键配置项和方法：

#### 核心配置项（State）
| 配置项           | 类型                          | 说
明                                                        
         |
|------------------|-------------------------------|
----------------------------------------------------------
------------|
| `components`     | `Component[]`                 | 存储
当前画布中所有组件的元数据（类型、位置、样式、属性等）           |
| `selectedComponentIndex` | `number`             | 当前选
中组件的索引（-1 表示未选
中）                                 |
| `currentView`    | `'pc' | 'mobile'`             | 当前
画布视图类型（控制移动端/PC端布局适
配）                          |
| `projectName`    | `string`                      | 当前
项目名称（用于保存和展
示）                                       |
| `canvasStyle`    | `CanvasStyle`（自定义类型）   | 画布全局
样式（如宽度、高度、背景色等，示例：`{ width: '1200px', 
height: '800px', backgroundColor: '#f5f5f5' }`） |

#### 核心配置对象（Config）
除状态外，`canvas.ts` 还包含以下核心配置对象，用于定义组件的默认属
性、样式和可配置参数：

| 配置对象          | 类型                          | 说
明                                                        
         |
|-------------------|-------------------------------|
----------------------------------------------------------
------------|
| `defaultWidths`   | `Record<string, any>`         | 定义
各组件的默认宽度值，部分组件支持动态适配（如 `QuestionRenderer` 
根据 `pc/mobile` 视图返回不同宽度）<br>**示例**：`'el-input': 
200`（固定宽度），`'QuestionRenderer': (viewType) => 
viewType === 'pc' ? 400 : 365`（动态宽度） |
| `componentConfigs`| `Record<string, { props: any; 
styles: any }>` | 定义每个组件的可配置属性（`props`）和样式
（`styles`），包含类型（输入框/单选框/颜色选择器等）、选项
（`options`）和显示名称（`name`）<br>**示例**：`'el-button'` 
包含 `type`（按钮类型，单选）、`plain`（是否朴素按钮，开关）等属
性，样式包含 `width`（宽度）、`color`（文本颜色）等 |
| `defaultProps`    | `Record<string, Record<string, 
any>>` | 各组件的默认属性值，用于新组件创建时的初始状态<br>**示例
**：`'el-button'` 默认属性为 `{ placeholder: '按钮', type: 
'primary' }` |
| `defaultStyles`   | `Record<string, Record<string, 
any>>` | 各组件的默认样式值，包含尺寸（`width`/`height`）、颜色
等基础样式属性<br>**示例**：`'el-button'` 默认样式为 `{ 
width: '', height: '', color: '' }` |

#### 核心方法（Actions）
| 方法名                  | 参数说
明                                                        
         | 功能描
述                                                        
         |
|-------------------------|
----------------------------------------------------------
----------------|
----------------------------------------------------------
----------------|
| `handleDrop`            | `DragEvent`, `HTMLElement`（画
布DOM节点）                               | 处理组件拖拽到画布
的逻辑，计算组件位置并添加到 `components` 列表        |
| `updateComponentProps`  | `index: number`, `newProps: 
Record<string, any>`                         | 更新指定索引
组件的属性（如按钮文本、输入框占位符等），触发视图同步更新  |
| `selectComponent`       | `index: 
number`                                                   
       | 选中指定索引的组件，更新 `selectedComponentIndex` 状
态（用于属性面板联动） |
| `saveCanvas`            | 
无                                                        
               | 将当前画布状态（`components`、
`projectName` 等）持久化到 `localStorage` |
| `loadProject`           | `projectId: 
string`                                                   
   | 根据项目ID从 `localStorage` 加载历史项目数据，初始化画布状
态            |

## 六、扩展说明

### 1. 新增组件完整流程
添加一个新组件需完成以下步骤（以自定义组件 `NewComponent` 为例）：

#### 1. 注册组件（`ui-config.ts`）
在 `src/ui-config.ts` 的 `customComponents` 中注册新组件（若
为 Element Plus/Vant 组件，则在对应 `elementPlusComponents`/
`vantComponents` 中注册）：
```typescript
// src/ui-config.ts
export const customComponents = {
  QuestionRenderer,
  NewComponent // 新增组件
}
``` 
#### 2. 配置默认宽度（ canvas.ts ）
在 defaultWidths 中添加新组件的默认宽度（可选，根据需要配置）：

```typescript
// src/stores/canvas.ts
const defaultWidths: Record<string, any> = {
  // ...其他组件
  'NewComponent': 300 // 新组件默认宽度 300px
} as const
```
#### 3. 定义可配置属性和样式（ canvas.ts ）
在 componentConfigs 中定义新组件的可配置属性（ props ）和样式（ styles ）：
```typescript
// src/stores/canvas.ts
const componentConfigs: Record<string, any> = {
  // ...其他组件配置
  'NewComponent': {
    props: {
      title: { name: '标题', type: 'input', placeholder: '请输入标题' }, // 输入框属性
      isHighlight: { name: '高亮显示', type: 'switch' } // 开关属性
    },
    styles: {
      ...sizeStyles, // 继承尺寸样式（宽度/高度）
      backgroundColor: { name: '背景颜色', type: 'color' } // 颜色样式
    }
  }
} as const
```
#### 4. 配置默认属性和样式（ canvas.ts ）
在 defaultProps 和 defaultStyles 中添加新组件的默认值：
```typescript
// src/stores/canvas.ts
const defaultProps: Record<string, Record<string, any>> = {
  // ...其他组件
  'NewComponent': { title: '新组件', isHighlight: false } // 默认属性
} as const

const defaultStyles: Record<string, Record<string, any>> = {
  // ...其他组件
  'NewComponent': { width: 300, height: 100, widthUnit: 'px', heightUnit: 'px', backgroundColor: '#fff' } // 默认样式
} as const
```
#### 5. 添加组件库展示（ ComponentLibrary.vue ）
在组件库面板（ src/components/ComponentLibrary.vue ）的网格中添加新组件的展示项，确保用户可从左侧组件库拖拽使用。
#### 6. 适配属性面板（ PropertyPanel.vue ）
若新组件需要特殊属性配置逻辑（如复杂交互），需在属性面板（ src/components/PropertyPanel.vue ）中添加对应类型的处理逻辑。