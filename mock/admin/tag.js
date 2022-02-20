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
            status: 40
          },
          {
            tag_name: 'Python',
            tag_id: 100002,
            blog_count: 100,
            status: 20
          },
          {
            tag_name: 'Go',
            tag_id: 100003,
            blog_count: 100,
            status: 50
          }
        ]
      }
    }
  },
  {
    url: '/api/v1/getAllTags',
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
            status: 20
          },
          {
            tag_name: 'Python',
            tag_id: 100002,
            blog_count: 100,
            status: 20
          },
          {
            tag_name: 'Go',
            tag_id: 100003,
            blog_count: 100,
            status: 20
          },
          {
            tag_name: 'PHP',
            tag_id: 100001,
            blog_count: 100,
            status: 20
          },
          {
            tag_name: 'C',
            tag_id: 100002,
            blog_count: 100,
            status: 20
          },
          {
            tag_name: 'C++',
            tag_id: 100003,
            blog_count: 100,
            status: 20
          },
          {
            tag_name: 'Vue',
            tag_id: 100001,
            blog_count: 100,
            status: 20
          },
          {
            tag_name: 'React',
            tag_id: 100002,
            blog_count: 100,
            status: 20
          },
          {
            tag_name: 'Spring',
            tag_id: 100003,
            blog_count: 100,
            status: 20
          }
        ]
      }
    }

  }
]
