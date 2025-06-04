const defaultData = {
  'c-bar-chart': {
    columns: [
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
    ],
    data: [
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
    ],
    rowTitles: ['2024', '2025']
  }
} as const

export default defaultData