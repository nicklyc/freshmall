import request from '@/utils/request'
// 新鲜时报
export function queryStore(data) {
  // 仓库接口模糊查询
  return request({
    method: 'get',
    params: {
      _gp: 'admin.newtimes',
      _mt: 'storagAllName',
      ...data
    }
  })
}

export function getNewTimes(data) {
  // 获取该仓库下的新鲜时报
  return request({
    method: 'get',
    params: {
      _gp: 'admin.newtimes',
      _mt: 'getNewTimes',
      ...data
    }
  })
}

export function updageOrAdd(data) {
  // 仓库接口模糊查询
  return request({
    method: 'get',
    params: {
      _gp: 'admin.newtimes',
      _mt: 'updageOrAdd',
      ...data
    }
  })
}
