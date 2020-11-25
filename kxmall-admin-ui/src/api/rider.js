import request from '@/utils/request2'
import Qs from 'qs'

export function fetchRiderList(query) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.rider',
      _mt: 'list',
      ...query
    }
  })
}
export function createRider(riderDTO) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.rider',
      _mt: 'create',
      riderDTO: JSON.stringify(riderDTO)
    })
  })
}
export function editRider(rider) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.rider',
      _mt: 'update',
      rider: JSON.stringify(rider)
    })
  })
}
export function getDetailById(id) {
  return request({
    method: 'get',
    params: {
      _gp: 'admin.rider',
      _mt: 'getDetailById',
      id
    }
  })
}

export function updateBusinessStateToRest(ids) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.rider',
      _mt: 'updateBusinessStateToRest',
      ids: JSON.stringify(ids)
    })
  })
}
export function updateBusinessWorkState(ids) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.rider',
      _mt: 'updateBusinessWorkState',
      ids: JSON.stringify(ids)
    })
  })
}
// export function updateStateToAbort(ids) {
//   const a = Qs.stringify({
//     _gp: 'admin.rider',
//     _mt: 'updateStateToAbort',
//     ids
//   })
//   console.error(a)
//   debugger
//   return request({
//     method: 'post',
//     data: Qs.stringify({
//       _gp: 'admin.rider',
//       _mt: 'updateStateToAbort',
//       ids
//     })
//   })
// }
export function updateStateToAbort(ids) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.rider',
      _mt: 'updateStateToAbort',
      ids: JSON.stringify(ids)
    })
  })
}
export function updateStateToNomral(ids) {
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.rider',
      _mt: 'updateStateToNomral',
      ids: JSON.stringify(ids)
    })
  })
}
