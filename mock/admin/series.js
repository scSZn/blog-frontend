module.exports = [
  {
    url: '/api/v1/series',
    type: 'get',
    response: config => {
      return {
        code: 0,
        msg: '',
        data: [
          {
            series_name: 'Java',
            series_id: 100001
          },
          {
            series_name: 'Python',
            series_id: 100002
          },
          {
            series_name: 'Go',
            series_id: 100003
          }
        ]
      }
    }

  }
]
