import request from '@/utils/request'
/* 一些公共的 所有接口*/

// 根据用户id查询工厂 得到用户下的所有工厂
export function getFactories(id) {
  return request({
    url: `/api/factories/${id}`,
    method: 'get'
  })
}
// 根据工厂查询供应商
export function getFindbyFactory(params) {
  return request({
    url: `/api/factoryVendor/findbyFactory`,
    method: 'get',
    params
  })
}
// 根据工厂id查询仓库 factoryId=3
export function getWarehousesInfo(params) {
  return request({
    url: `/api/warehouses/base_info`,
    method: 'get',
    params
  })
}
// 根据仓库ID查询库区 /api/warehouse_areas/base_info?warehouseId=111
export function getWarehouseAreas(params) {
  return request({
    url: `/api/warehouse_areas/base_info`,
    method: 'get',
    params
  })
}
// 查询库区下货位 /api/spots/base_info?warehouseAreaId=xx
export function getWarehouseAreaId(warehouseAreaId) {
  return request({
    url: `/api/spots/base_info?warehouseAreaId=${warehouseAreaId}`,
    method: 'get'
  })
}
// 查询所有工厂
export function getFactoriesAll() {
  return request({
    url: `/api/factories/all`,
    method: 'get'
  })
}

// 获取类别
export function getCategory(params) {
  return request({
    url: '/api/material_dicts/type/category',
    method: 'get',
    params
  })
}

// Excel 导入库位
export function setImportFromExcel(data) {
  return request({
    url: '/api/spots/import_from_excel',
    method: 'post',
    data
  })
}

// Excel 导入 期初库存导入
export function setItemsImportFromExcel(data) {
  return request({
    url: '/api/items/import_from_excel',
    method: 'post',
    data
  })
}

