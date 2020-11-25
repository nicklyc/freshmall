import request from '@/utils/request'
const uploadPath = 'http://114.67.94.213:8080/upload/admin' // process.env.HOST + '/upload/admin'
export { uploadPath }

export function createStorage(data) {
  return request({
    url: uploadPath,
    method: 'post',
    data
  })
}
