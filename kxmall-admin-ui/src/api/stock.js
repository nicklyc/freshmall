import request from '@/utils/request'

export function fetchWarningList(query) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.stock',
      _mt: 'warningList',
      ...query
    }
  })
}
export function editWarning(query) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.stock',
      _mt: 'warningUpdate',
      ...query
    }
  })
}
