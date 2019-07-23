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

// 删除菜单
export function deleteMenus(id) {
  return request({
    url: `/api/menus/${id}`,
    method: 'delete'
  })
}
