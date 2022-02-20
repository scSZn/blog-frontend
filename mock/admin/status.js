module.exports = [
  {
    url: '/api/v1/articles/status',
    type: 'get',
    response: config => {
      return {
        code: 0,
        msg: '',
        data: [
          {
            value: 0,
            name: 'draft',
            display: '草稿'
          },
          {
            value: 10,
            name: 'waiting_audit',
            display: '待审核'
          },
          {
            value: 20,
            name: 'published',
            display: '发布'
          },
          {
            value: 30,
            name: 'reject',
            display: '拒绝'
          },
          {
            value: 40,
            name: 'forbidden',
            display: '禁用'
          },
          {
            value: 50,
            name: 'deleted',
            display: '已删除'
          }
        ]
      }
    }
  },
  {
    url: '/api/v1/tag/status',
    type: 'get',
    response: config => {
      return {
        code: 0,
        msg: '',
        data: [
          {
            value: 20,
            name: 'published',
            display: '生效中'
          },
          {
            value: 40,
            name: 'forbidden',
            display: '禁用'
          },
          {
            value: 50,
            name: 'deleted',
            display: '删除'
          }
        ]
      }
    }
  }
]
