import request from '@/utils/export'
/* 所有关于下载的接口*/

// 出入库明细报表导出-GET
export function getInOutDetailExport(params) {
  return request({
    url: `/api/report/in_out_detail/export`,
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 库存报表导出-GET
export function getInventoryExport(params) {
  return request({
    url: `/api/report/inventory/export`,
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 订单投料批次报表 下载-GET
export function getProductionOrderFeedThroatExport(params) {
  return request({
    url: `/api/report/productionOrderFeedThroat/export`,
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 货位物料库存 下载-GET
export function getSpotMaterialInventoryExport(params) {
  return request({
    url: `/api/report/spotMaterialInventory/export`,
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 货位物料库存 下载-GET
export function getSafeQuantityExport(params) {
  return request({
    url: `/api/report/safeQuantity/export`,
    method: 'get',
    responseType: 'blob',
    params
  })
}

