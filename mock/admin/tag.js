module.exports = [
  {
    url: '/api/v1/tags',
    type: 'get',
    response: config => {
      return {
        code: 0,
        msg: '',
        data: [
          {
            tag_name: 'Java',
            tag_id: 100001,
            blog_count: 100,
            status: {
              value: 1,
              name: 'draft',
              display: '禁用'
            }
          },
          {
            tag_name: 'Python',
            tag_id: 100002,
            blog_count: 100,
            status: {
              value: 1,
              name: 'published',
              display: '生效中'
            }
          },
          {
            tag_name: 'Go',
            tag_id: 100003,
            blog_count: 100,
            status: {
              value: 1,
              name: 'draft',
              display: '禁用'
            }
          }
        ]
      }
    }

  }
]
