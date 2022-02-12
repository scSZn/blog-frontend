import request from '@/utils/request'

export function getAllStatus(params) {
  return request({
    url: '/api/v1/status',
    method: 'get',
    params
  })
}

