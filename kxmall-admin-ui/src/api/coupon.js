import request from '@/utils/request'
import Qs from 'qs'

export function listCoupon(query) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.coupon',
      _mt: 'queryCouponByTitle',
      ...query
    }
  })
}

export function createCoupon(couponDO) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.coupon',
      _mt: 'addCoupon',
      couponDTO: JSON.stringify(couponDO)
    })
  })
}

export function updateCoupon(couponDO) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.coupon',
      _mt: 'updateCoupon',
      couponDTO: JSON.stringify(couponDO)
    })
  })
}

export function updateCouponStatus(data) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.coupon',
      _mt: 'updateCouponStatus',
      ...data
    })
  })
}

export function activeCoupon(data) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.coupon',
      _mt: 'updateCouponStatus',
      ...data
    })
  })
}

export function deleteCoupon(data) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.coupon',
      _mt: 'deleteCoupon',
      ...data
    }
  })
}

export function queryUserCouponByList(data) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.coupon',
      _mt: 'queryUserCouponByList',
      ...data
    }
  })
}

export function queryCouponById(data) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.coupon',
      _mt: 'queryCouponById',
      ...data
    }
  })
}

export function queryCouponByIds(idsJson) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.coupon',
      _mt: 'queryCouponByIds',
      idsJson: JSON.stringify(idsJson)
    })
  })
}
