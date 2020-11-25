import request from '@/utils/request'
import Qs from 'qs'

export function fetchActivityList(query) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.activity',
      _mt: 'list',
      ...query
    }
  })
}
export function createActivity(activityDTO) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.activity',
      _mt: 'create',
      activityDTO: JSON.stringify(activityDTO)
    })
  })
}
export function editActivity(activityDTO) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.activity',
      _mt: 'edit',
      activityDTO: JSON.stringify(activityDTO)
    })
  })
}

export function updateStatusActivityStatus(query) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.activity',
      _mt: 'updateStatus',
      ...query
    })
  })
}
export function getActivityTypeEnums() {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.activity',
      _mt: 'getActivityTypeEnums'
    })
  })
}

export function queryActivityById(id) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.activity',
      _mt: 'queryActivityById',
      id
    })
  })
}

export function generateLinkes(activityType) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.activity',
      _mt: 'generateLinkes',
      activityType
    })
  })
}

export function fetchUserList(query) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.coupon',
      _mt: 'queryUserCouponByList',
      ...query
    }
  })
}
