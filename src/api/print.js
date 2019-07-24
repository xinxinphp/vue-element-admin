import request from '@/utils/request'
/* 权限管理 所有接口*/

// 获取有订单打印item的初始化信息
export function getOrdersInitItemInfo(poiId) {
  return request({
    url: `/api/purchase_orders/init_item_info/${poiId}`,
    method: 'get'
  })
}
// 点击确认打印
export function saveCreateItems(data) {
  return request({
    url: '/api/items/create_items',
    method: 'post',
    data
  })
}
// 获取标签进行漏打补打列表
export function getItems(params) {
  return request({
    url: `/api/items`,
    method: 'get',
    params
  })
}
// 获取标签进行漏打补打列表
export function getReprint(id) {
  return request({
    url: `/api/items/reprint/${id}`,
    method: 'get'
  })
}

// 作废item
export function setDisable(id) {
  return request({
    url: `/api/items/disable/${id}`,
    method: 'post'
  })
}
