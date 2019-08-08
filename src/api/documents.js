import request from '@/utils/request'
/* 单据 所有接口*/

// 获取有采购订单列表
export function getOrderItemList(params) {
  return request({
    url: '/api/purchase_orders/order_item_list',
    method: 'get',
    params
  })
}
// 获取 收货单 列表
export function getReceiptOrders(params) {
  return request({
    url: '/api/receipt_orders',
    method: 'get',
    params
  })
}
// 设置 收货单 质检信息录入
export function setQualityInspectionStatus(data) {
  return request({
    url: '/api/receipt_orders/quality_inspection',
    method: 'post',
    data
  })
}
// 收货确认
export function setReceiptConfirm(id) {
  return request({
    url: `/api/receipt_orders/receipt_confirm/${id}`,
    method: 'post'
  })
}
// 入库确认
export function setInboundConfirm(id) {
  return request({
    url: `/api/receipt_orders/inbound_confirm/${id}`,
    method: 'post'
  })
}

// 获取 已打印标签但尚未入库的item
export function getPrintNotInbound(params) {
  return request({
    url: '/api/items/print_not_inbound',
    method: 'get',
    params
  })
}

// 设置绑定货位
export function setBindSpot(data) {
  return request({
    url: '/api/items/bind_spot',
    method: 'POST',
    data
  })
}

/** **************************************************/
// 获取 生产订单 列表
export function getProductionOrdersOrderItemList(params) {
  return request({
    url: '/api/production_orders/order_item_list',
    method: 'get',
    params
  })
}
/** **************************************************/
// 获取 出库提单 列表
export function getLadingOrders(params) {
  return request({
    url: '/api/lading_orders/order_item_list',
    method: 'get',
    params
  })
}
// 获取 出库提单 列表 切换可用状态
export function setLadingOrders(loId) {
  return request({
    url: `/api/lading_orders/toggle_enabled/${loId}`,
    method: 'post'
  })
}
/** **************************************************/
// 获取 SAP领料单 列表
export function getPickOrders(params) {
  return request({
    url: '/api/pick_orders/order_item_list',
    method: 'get',
    params
  })
}
// 获取 SAP领料单 列表 切换可用状态
export function setPickOrders(pkoId) {
  return request({
    url: `/api/pick_orders/toggle_enabled/${pkoId}`,
    method: 'post'
  })
}
