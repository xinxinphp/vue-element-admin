import request from '@/utils/request'
/* 主数据 所有接口*/

// 获取物料信息接口
export function getMaterialsInfo(params) {
  return request({
    url: `/api/materials/info`,
    method: 'get',
    params
  })
}
// 获取物料 品牌
export function getMaterialBrand() {
  return request({
    url: '/api/material_dicts/type/brand',
    method: 'get'
  })
}

// 获取物料 类别
export function getMaterialCategory() {
  return request({
    url: '/api/material_dicts/type/category',
    method: 'get'
  })
}

// 获取物料 小类
export function getMaterialSmallCategory() {
  return request({
    url: '/api/material_dicts/type/small_category',
    method: 'get'
  })
}

// 保存更新物料信息
export function setMaterialsInfo(data) {
  return request({
    url: `/api/materials/update_info`,
    method: 'put',
    data
  })
}
// 获取物料 小类
export function getItemsVendor(params) {
  return request({
    url: '/api/items/vendor',
    method: 'get',
    params
  })
}

export function getItemsFrozen(params) {
  return request({
    url: '/api/items/frozen',
    method: 'get',
    params
  })
}

// frozenType 1冻结 2解冻
export function setItemsFrozenType(frozenType, data) {
  return request({
    url: `/api/items/frozenItem/${frozenType}`,
    method: 'put',
    data
  })
}
