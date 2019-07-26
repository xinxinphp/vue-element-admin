import request from '@/utils/request'
/* 组织架构管理 所有接口*/

// 获取 工厂列表
export function getFactories(params) {
  return request({
    url: `/api/factories`,
    method: 'get',
    params
  })
}
// 获取 添加/修改工厂
export function setFactories(data) {
  return request({
    url: `/api/factories`,
    method: 'post',
    data
  })
}
