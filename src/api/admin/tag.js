import request from '@/utils/request'

export function createTag(data) {
  return request({
    url: '/api/v1/admin/tags',
    method: 'post',
    data
  })
}

export function deleteTag(tagID) {
  return request({
    url: '/api/v1/admin/tags/' + tagID,
    method: 'delete'
  })
}

export function getTags(params) {
  return request({
    url: '/api/v1/admin/tags',
    method: 'get',
    params
  })
}

export function getTagStatusConfig(params) {
  return request({
    url: '/api/v1/admin/tags/status',
    method: 'get',
    params
  })
}
