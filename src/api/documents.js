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
// 获取 收货单 收货确认
export function setReceiptConfirm(id) {
  return request({
    url: `/api/receipt_orders/receipt_confirm/${id}`,
    method: 'post'
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
