<!--
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-05-29 15:23:11
 * @LastEditors: zwcong
 * @LastEditTime: 2025-06-06 14:52:34
-->
<template>
    <div>
        <v-chart :option="option" />
    </div>
</template>
  
<script setup>
import { computed} from 'vue'
defineOptions({
    name: 'CPieChart'
})
const props = defineProps({
    title: {
        type: String,
        default: '饼图'
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
    legendOrient: {
        type: String,
        default: 'vertical'
    },
    legendAlign: {
        type: String,
        default: 'left'
    },
    legendData: {
        type: Array,
        default: () => ['数据1', '数据2', '数据3']
    },
    columns: {
        type: Object,
        default: () => ({
            columns: ['A', 'B', 'C']
        })
    },
    // yAxisData: {
    //     type: Array,
    //     default: () => ['A', 'B', 'C']
    // },
    seriesName: {
        type: String,
        default: '数据'
    },
    isShowRoseType: {
        type: Boolean,
        default: false
    },
    seriesInsideRadius: {
        type: Number,
        default: 0
    },
    seriesOutsideRadius: {
        type: Number,
        default: 50
    },
    seriesLabelShow: {
        type: Boolean,
        default: true
    },
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
    }
})

const option = computed(() => {
    console.log('props', props, props.data[0])
    return {
        title: {
            text: props.title,
            left: props.titleAlign
        },
        tooltip: {
            trigger: props.tooltipTrigger,
            formatter: props.tooltipFormatter
        },
        legend: {
            orient: props.legendOrient,
            align: props.legendAlign,
            data: props.legendData
        },
        series: [{
            name: props.seriesName,
            type: 'pie',
            radius: [props.seriesInsideRadius, props.seriesOutsideRadius],
            // center: props.seriesCenter,
            label: {
                show: props.seriesLabelShow,
            },
            roseType: props.isShowRoseType ? 'radius' : '',
            data: Object.values(props.data[0]).map((item, index) => ({
                value: item,
                name: props.columns.columns[index].label
            })),
            emphasis: {
                itemStyle: {
                    shadowBlur: props.emphasisItemShadowBlur,
                    shadowOffsetX: props.emphasisItemShadowOffsetX,
                    shadowColor: props.emphasisItemShadowColor
                }
            }
        }
    ]}
})
</script>