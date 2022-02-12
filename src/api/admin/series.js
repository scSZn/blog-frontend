import request from '@/utils/request'

export function getAllSeries(params) {
  return request({
    url: '/api/v1/series',
    method: 'get',
    params
  })
}
