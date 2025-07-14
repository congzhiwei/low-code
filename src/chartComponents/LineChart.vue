<!--
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-05-29 15:23:11
 * @LastEditors: zwcong
 * @LastEditTime: 2025-07-14 18:42:36
-->
<template>
    <div :style="componentStyle">
        <v-chart :option="option" ref="chartRef"  />
    </div>
</template>
  
<script setup>
import { computed, watch, ref } from 'vue'
defineOptions({
    name: 'CLineChart'
})
const props = defineProps({
    style: {
        type: Object,
        default: () => ({})
    },
    title: {
        type: String,
        default: '折线图'
    },
    titleShow: {
        type: Boolean,
        default: true
    },
    titleAlign: {
        type: String,
        default: 'center'
    },
    tooltipTrigger: {
        type: String,
        default: 'item'
    },
    tooltipFormatter: {
        type: String,
        default: '{a} <br/>{b} : {c} ({d}%)'
    },
    orient: {
        type: String,
        default: 'vertical'
    },
    legendAlign: {
        type: String,
        default: 'bottom'
    },
    legendShow: {
        type: Boolean,
        default: false
    },
    columns: {
        type: Object,
        default: () => ({
            columns: ['A', 'B', 'C']
        })
    },
    isSmooth: {
        type: Boolean,
        default: false
    },
    // yAxisData: {
    //     type: Array,
    //     default: () => ['A', 'B', 'C']
    // },
    // seriesName: {
    //     type: String,
    //     default: '数据'
    // },
    // seriesRadius: {
    //     type: String,
    //     default: '50%'
    // },
    seriesCenter: {
        type: Array,
        default: () => ['50%', '50%']
    },
    data: {
        type: Array,
        default: () => [10, 20, 30]
    },
    emphasisItemShadowBlur: {
        type: Number,
        default: 10
    },
    emphasisItemShadowOffsetX: {
        type: Number,
        default: 0
    },
    emphasisItemShadowColor: {
        type: String,
        default: 'rgba(0, 0, 0, 0.5)'
    },
    rowTitles: {
        type: Array,
        default: () => []
    }
})

const componentStyle = computed(() => props.style)
const chartRef = ref(null)
watch(() => props.style, (newStyle) => {
  if (chartRef.value) {
    chartRef.value.resize()  // 调用图表库的 resize 方法
  }
}, { deep: true })  // 深度监听样式对象变化

const option = computed(() => {
    return {
        title: {
            text: props.title,
            left: props.titleAlign,
            show: props.titleShow
        },
        grid: {
            left: props.legendAlign === 'left'?'15%':'5%',
            bottom: props.legendAlign === 'bottom'?'10%':'5%',
            right: props.legendAlign === 'right'?'15%':'5%',
            top: '18%',
            containLabel: true
        },
        tooltip: {
            trigger: props.tooltipTrigger,
            formatter: props.tooltipFormatter
        },
        legend: {
            orient: props.legendAlign === 'left' || props.legendAlign === 'right' ? 'vertical' : 'horizontal',
            top: props.legendAlign === 'top' || props.legendAlign === 'bottom' ? props.legendAlign : 'center',
            left: props.legendAlign === 'left' || props.legendAlign === 'right'? props.legendAlign : 'center',
            data: props.legendShow ? props.rowTitles.map(col => col) : []
        },
        xAxis: {
            type: props.orient === 'vertical' ? 'value' : 'category',
            data: props.columns.columns.map(item=> item.label)
        },
        yAxis: {
            type: props.orient ==='vertical'? 'category' : 'value',
            data: props.columns.columns.map(item=> item.label)
        },
        series: props.data.map((item, index) => ({
            name: props.rowTitles[index],
            type: 'line',
            // radius: props.seriesRadius,
            smooth: props.isSmooth,
            center: props.seriesCenter,
            data: Object.values(item),
            emphasis: {
                itemStyle: {
                    shadowBlur: props.emphasisItemShadowBlur,
                    shadowOffsetX: props.emphasisItemShadowOffsetX,
                    shadowColor: props.emphasisItemShadowColor
                }
            }
        }))
    }
})
</script>