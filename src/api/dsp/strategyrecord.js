import request from '@/utils/request'

export function fetchStrategyRecordList(query) {
  return request({
    url: '/admin/strategy/record/list',
    method: 'POST',
    data: query,
    header:{'Content-Type':'application/json;charset=UTF-8'}
  })
}
