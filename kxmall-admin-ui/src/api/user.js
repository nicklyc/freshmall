import request from '@/utils/request'

export function fetchList(query) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.user',
      _mt: 'query',
      ...query
    }
  })
}

export function activeUser(data) {
  return request({
    method: 'post',
    params: {
      _gp: 'admin.user',
      _mt: 'updateStatus',
      userId: data.id,
      status: data.status
    }
  })
}

export function createUser(data) {
  return request({
    method: 'post',
    params: {
      _gp: 'admin.user',
      _mt: 'create',
      user: JSON.stringify(data)
    }
  })
}

export function updateUser(data) {
  return request({
    method: 'post',
    params: {
      _gp: 'admin.user',
      _mt: 'update',
      user: JSON.stringify(data)
    }
  })
}

export function deleteUser(id, nickname) {
  return request({
    method: 'post',
    params: {
      _gp: 'admin.user',
      _mt: 'delete',
      id: id,
      nickname: nickname
    }
  })
}
