import request from '@/utils/request'
import Qs from 'qs'

export function outStockList(data) {
  /* 商品出库列表*/
  return request({
    method: 'get',
    params: {
      _gp: 'admin.goodsOutStock',
      _mt: 'list',
      ...data
    }
  })
}

export function getGoodsList(data) {
  /* 获取商品*/
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.stock',
      _mt: 'list',
      ...data
    })
  })
}

export function outStockCreate(data) {
  /* 商品出库 添加*/
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.goodsOutStock',
      _mt: 'create',
      goodsOutStockDTO: JSON.stringify(data)
    })
  })
}

export function outStockDeleteAll(data) {
  /* 商品出库 删除*/
  return request({
    method: 'get',
    params: {
      _gp: 'admin.goodsOutStock',
      _mt: 'delete',
      ...data
    }
  })
}

export function outStockSelectById(data) {
  /* 商品出库 获取详情信息*/
  return request({
    method: 'get',
    params: {
      _gp: 'admin.goodsOutStock',
      _mt: 'selectById',
      ...data
    }
  })
}

export function outStockUpdate(data) {
  /* 商品出库 更新商品信息*/
  return request({
    method: 'post',
    data: Qs.stringify({
      _gp: 'admin.goodsOutStock',
      _mt: 'update',
      goodsOutStockDTO: JSON.stringify(data)
    })
  })
}

export function outStockUpdateOutOfStock(data) {
  /* 商品出库  出库*/
  return request({
    method: 'get',
    params: {
      _gp: 'admin.goodsOutStock',
      _mt: 'updateOutOfStock',
      ...data
    }
  })
}

export function outStockStoragAllName(data) {
  /* 商品出库  获取所有仓库*/
  return request({
    method: 'get',
    params: {
      _gp: 'admin.goodsOutStock',
      _mt: 'storagAllName',
      ...data
    }
  })
}
