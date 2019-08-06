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
