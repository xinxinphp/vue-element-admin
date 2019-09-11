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
// 获取 录生成辅料日报表页面 List
export function warehouseDailyQueryBeforeCreate(params) {
  return request({
    url: '/api/warehouse_daily/query_before_create',
    method: 'get',
    params
  })
}

// 生成辅料日报表 [生成报表]按钮
export function getWarehouseDailyCreate(data) {
  return request({
    url: `/api/warehouse_daily/create`,
    method: 'POST',
    data
  })
}

// 生成辅料日报表 [删除报表]按钮
export function getWarehouseDailyDelete(data) {
  return request({
    url: `/api/warehouse_daily/delete`,
    method: 'DELETE',
    data
  })
}
