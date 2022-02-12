module.exports = [
  {
    url: '/api/v1/status',
    type: 'get',
    response: config => {
      return {
        code: 0,
        msg: '',
        data: [
          {
            value: 1,
            name: 'draft',
            display: '草稿'
          },
          {
            value: 2,
            name: 'published',
            display: '发布'
          },
          {
            value: 3,
            name: 'deleted',
            display: '删除'
          }
        ]
      }
    }

  }
]
