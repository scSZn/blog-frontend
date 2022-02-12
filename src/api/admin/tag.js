import request from '@/utils/request'

export function getAllTags(params) {
  return request({
    url: '/api/v1/tags',
    method: 'get',
    params
  })
}
