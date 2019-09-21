import request from '@/utils/request'

export function fetchListTag(query) {
  return request({
    url: '/admin/tag/list',
    method: 'POST',
    data: query,
    header:{'Content-Type':'application/json;charset=UTF-8'}
  })
}

export function saveTag(query) {
  return request({
    url: '/admin/tag/save',
    method: 'POST',
    data: query,
    header:{'Content-Type':'application/json;charset=UTF-8'}
  })
}
