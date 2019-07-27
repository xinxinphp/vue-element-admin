import request from '@/utils/request'
/* 组织架构管理 所有接口*/

// 获取 工厂列表
export function getFactories(params) {
  return request({
    url: `/api/factories`,
    method: 'get',
    params
  })
}
// 获取 添加/修改工厂
export function setFactories(data) {
  return request({
    url: `/api/factories`,
    method: 'post',
    data
  })
}
/** *************************************/
// 获取 仓库列表
export function getWarehouses(params) {
  return request({
    url: `/api/warehouses`,
    method: 'get',
    params
  })
}
// 获取 添加/修改仓库
export function setWarehouses(data) {
  return request({
    url: `/api/warehouses`,
    method: 'post',
    data
  })
}
/** *************************************/
// 获取 库区列表
export function getWarehouseAreas(params) {
  return request({
    url: `/api/warehouse_areas`,
    method: 'get',
    params
  })
}
// 获取 添加/修改库区
export function setWarehouseAreas(data) {
  return request({
    url: `/api/warehouse_areas`,
    method: 'post',
    data
  })
}
/** *************************************/
// 获取 货位列表
export function getSpots(params) {
  return request({
    url: `/api/spots`,
    method: 'get',
    params
  })
}
// 获取 添加/修改货位
export function setSpots(data) {
  return request({
    url: `/api/spots`,
    method: 'post',
    data
  })
}

// 获取 删除 货位
export function deleteSpots(id) {
  return request({
    url: `/api/spots/${id}`,
    method: 'delete'
  })
}

