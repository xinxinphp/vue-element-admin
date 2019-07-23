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
