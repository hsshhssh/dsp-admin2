import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/strategy/list',
    method: 'POST',
    data: query,
    header:{'Content-Type':'application/json;charset=UTF-8'}
  })
}

export function getStrategy(query) {
  return request({
    url: '/admin/strategy/get',
    method: 'POST',
    params : query
  })
}

export function saveStrategy(data) {
  return request({
    url: '/admin/strategy/save',
    method: 'POST',
    data: data,
    header:{'Content-Type':'application/json;charset=UTF-8'}
  })
}


export function copyStrategy(query) {
  return request({
    url: '/admin/strategy/copy',
    method: 'POST',
    params : query
  })
}

export function disableStrategy(query) {
  return request({
    url: '/admin/strategy/disable',
    method: 'POST',
    params : query
  })
}

export function enableStrategy(query) {
  return request({
    url: '/admin/strategy/enable',
    method: 'POST',
    params : query
  })
}

export function deleteStrategy(query) {
  return request({
    url: '/admin/strategy/delete',
    method: 'POST',
    params : query
  })
}

export function recoveryStrategy(query) {
  return request({
    url: '/admin/strategy/recovery',
    method: 'POST',
    params : query
  })
}

export function savePriceStrategy(query) {
  return request({
    url: '/admin/strategy/save/price',
    method: 'POST',
    params : query
  })
}

export function saveBudgetStrategy(query) {
  return request({
    url: '/admin/strategy/save/budget',
    method: 'POST',
    params : query
  })
}
