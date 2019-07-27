import request from '@/utils/request'
/* 一些公共的 所有接口*/

// 根据用户id查询工厂 得到用户下的所有工厂
export function getFactories(id) {
  return request({
    url: `/api/factories/${id}`,
    method: 'get'
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
// 查询所有工厂
export function getFactoriesAll() {
  return request({
    url: `/api/factories/all`,
    method: 'get'
  })
}

