import request from '@/utils/request'

export function info() {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.dashboard',
      _mt: 'integral'
    }
  })
}
// 用户数量统计
export function countUser(data) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.dashboard',
      _mt: 'countUser',
      ...data
    }
  })
}
// 销售统计
export function getSalesStatement(data) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.dashboard',
      _mt: 'getSalesStatement',
      ...data
    }
  })
}

// 近两日销售统计
export function getTodayAndYesterdaySales(data) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.dashboard',
      _mt: 'getTodayAndYesterdaySales',
      ...data
    }
  })
}

// 聚合数据
export function integral(data) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.dashboard',
      _mt: 'integral',
      ...data
    }
  })
}

// 按小时统计销量
export function getSalesByHour(data) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.dashboard',
      _mt: 'getSalesByHour',
      ...data
    }
  })
}

// 获取仓库
export function storageList(data) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.storage',
      _mt: 'list',
      ...data
    }
  })
}
