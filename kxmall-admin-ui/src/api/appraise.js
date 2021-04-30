import request from '@/utils/request'

export function listAppraise(query) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.appraise',
      _mt: 'getAppraiseList',
      ...query
    }
  })
}

export function deleteAppraise(data) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.appraise',
      _mt: 'deleteAppraise',
      ...data
    }
  })
}

export function changeState(data) {
  return request({
    method: 'get',
    params: {
      _gp: 'appraise',
      _mt: 'changeState',
      ...data
    }
  })
}
