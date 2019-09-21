import request from '@/utils/request'

export function fetchListAdplacement(query) {
  return request({
    url: '/admin/adplacement/list',
    method: 'POST',
    data: query,
    header:{'Content-Type':'application/json;charset=UTF-8'}
  })
}

export function sync() {
  return request({
    url: '/ruangao/sync/adplacement',
    method: 'GET'
  })
}

export function fetchMediaList() {
  return request({
    url: '/admin/adplacement/media/list',
    method: 'POST',
    header:{'Content-Type':'application/json;charset=UTF-8'}
  })
}


export function clearMediaList() {
  return request({
    url: '/admin/adplacement/media/list/clear',
    method: 'POST',
    header:{'Content-Type':'application/json;charset=UTF-8'}
  })
}
