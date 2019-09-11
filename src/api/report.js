import request from '@/utils/request'
/* 报表 所有接口*/

// 获取 出入库明细报表
export function getReportInOutDetail(params) {
  return request({
    url: `/api/report/in_out_detail`,
    method: 'get',
    params
  })
}
// 获取 所有的-业务类型
export function getBizTypes() {
  return request({
    url: `/api/common/biz_types`,
    method: 'get'
  })
}
// SAP过账记录-GET
export function getPostLogs(params) {
  return request({
    url: `/api/post_logs`,
    method: 'get',
    params
  })
}
// SAP过账明细-GET
export function getPostLogsList(id) {
  return request({
    url: `/api/post_logs/${id}`,
    method: 'get'
  })
}
// SAP过账重传-POST
export function getPostLogsRepost(id) {
  return request({
    url: `/api/post_logs/repost/${id}`,
    method: 'post'
  })
}

// 库存报表-GET
export function getReportInventory(params) {
  return request({
    url: `/api/report/inventory`,
    method: 'get',
    params
  })
}

// 订单投料批次报表-GET
export function getProductionOrderFeedThroat(params) {
  return request({
    url: `/api/report/productionOrderFeedThroat`,
    method: 'get',
    params
  })
}

// 货位物料库存-GET
export function getSpotMaterialInventory(params) {
  return request({
    url: `/api/report/spotMaterialInventory`,
    method: 'get',
    params
  })
}

// 安全库存-GET
export function getReportSafeQuantity(params) {
  return request({
    url: `/api/report/safeQuantity`,
    method: 'get',
    params
  })
}
// 辅料日报表-GET List
export function getWarehouseDaily(params) {
  return request({
    url: `/api/warehouse_daily`,
    method: 'get',
    params
  })
}
