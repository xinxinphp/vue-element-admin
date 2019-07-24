import request from '@/utils/request'
/* 一些公共的 所有接口*/

// 根据工厂id查询工厂
export function getFactories(id) {
  return request({
    url: `/api/factories/${id}`,
    method: 'get'
  })
}

