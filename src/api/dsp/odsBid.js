import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/ods/bid/list',
    method: 'POST',
    data: query,
    header:{'Content-Type':'application/json;charset=UTF-8'}
  })
}

