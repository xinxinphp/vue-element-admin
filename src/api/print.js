import request from '@/utils/request'
/* 权限管理 所有接口*/

// 获取有订单打印item的初始化信息
export function getOrdersInitItemInfo(poiId) {
  return request({
    url: `/api/purchase_orders/init_item_info/${poiId}`,
    method: 'get'
  })
}
// 点击确认打印printingWithOrders
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

// 根据工厂和物料，初始化item信息
export function getInitItemInfo(params) {
  return request({
    url: `/api/materials/init_item_info/`,
    method: 'get',
    params
  })
}
// 供应商生成标签 item
export function setcreateItemsByVendor(data) {
  return request({
    url: `/api/items/create_items_by_vendor/`,
    method: 'post',
    data
  })
}
// 无订单打印 供应商生成标签 item
export function setcreateItemsByNoOrder(data) {
  return request({
    url: `/api/items/create_items_by_noOrder`,
    method: 'post',
    data
  })
}
// 车牌号联想 prefix
export function getPrefixPlateNumber(params) {
  return request({
    url: `/api/input_log_dicts/prefix/plate_number`,
    method: 'get',
    params
  })
}
// 批次联想 prefix
export function getPrefixBatch(params) {
  return request({
    url: `/api/input_log_dicts/prefix/batch`,
    method: 'get',
    params
  })
}
