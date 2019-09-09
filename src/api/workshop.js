import request from '@/utils/request'
/* 权限管理 所有接口*/

// 获取 录入产量 List
export function getProductionOrders(params) {
  return request({
    url: '/api/production_orders',
    method: 'get',
    params
  })
}
// 获取 录入产量 行内编辑 List
export function setProductionOrdersInputYield(data) {
  return request({
    url: '/api/production_orders/inputYield',
    method: 'put',
    data
  })
}

