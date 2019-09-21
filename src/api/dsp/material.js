import request from '@/utils/request'

export function fetchListMaterial(query) {
  return request({
    url: '/admin/material/list',
    method: 'POST',
    data: query,
    header:{'Content-Type':'application/json;charset=UTF-8'}
  })
}

export function getMaterial(query) {
  return request({
    url: '/admin/material/get',
    method: 'POST',
    params : query
  })
}

export function saveMaterial(data) {
  return request({
    url: '/admin/material/save',
    method: 'POST',
    data: data,
    header:{'Content-Type':'application/json;charset=UTF-8'}
  })
}
