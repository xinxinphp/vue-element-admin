import request from '@/utils/request'
/* 主数据 所有接口*/

// 获取物料信息接口
export function getMaterialsInfo() {
  return request({
    url: `/api/materials/info`,
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
