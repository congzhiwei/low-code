/*
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-06-04 17:22:36
 * @LastEditors: zwcong
 * @LastEditTime: 2025-06-05 14:57:18
 */

const columns = [
    {
        "label": "中国",
        "prop": "a"
    },
    {
        "label": "美国",
        "prop": "b"
    },
    {
        "label": "法国",
        "prop": "c"
    },
    {
        "label": "英国",
        "prop": "d"
    },
    {
        "label": "德国",
        "prop": "e"
    }
]
const data = [
    {
        "a": "100",
        "b": "90",
        "c": "40",
        "d": "33",
        "e": "45",
    },
    {
        "a": "100",
        "b": "80",
        "c": "33",
        "d": "43",
        "e": "44",
    }
  ]

const rowTitles = ['2024', '2025']


const defaultData = {
    'c-pie-chart': {
        columns,
        data: data.splice(0, 1),
        rowTitles
    },
    'c-line-chart': {
        columns,
        data,
        rowTitles
    },
    'c-bar-chart': {
        columns,
        data,
        rowTitles
    }
} as const

export default defaultData