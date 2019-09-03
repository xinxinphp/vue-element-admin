import request from '@/utils/request'
/* 权限管理 所有接口*/

// 获取导航树
export function getMenus() {
  return request({
    url: '/api/menus/tree_view',
    method: 'get'
  })
}
// 保存菜单
export function saveMenus(data) {
  return request({
    url: '/api/menus',
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
/** ***************************************/
// 获取菜单
export function getRoles(id) {
  return request({
    url: `/api/roles`,
    method: 'get'
  })
}
// 获取菜单类型
export function getMenuTypes() {
  return request({
    url: `/api/common/menu_types`,
    method: 'get'
  })
}
// 获取角色下的菜单
export function getMenusRoleMenus(id) {
  return request({
    url: `/api/menus/role_menus/${id}`,
    method: 'get'
  })
}

// 保存角色
export function saveRoles(data) {
  return request({
    url: `/api/roles`,
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRoles(id) {
  return request({
    url: `/api/roles/${id}`,
    method: 'delete'
  })
}
/** ***************************************/
// 获取用户
export function getUsers(params) {
  return request({
    url: `/api/users`,
    method: 'get',
    params
  })
}
// 获取单个用户信息
export function getOneUsers(userId) {
  return request({
    url: `/api/users/${userId}`,
    method: 'get'
  })
}
// 获取所有工厂
export function getFactoriesAll() {
  return request({
    url: `/api/factories/all`,
    method: 'get'
  })
}
// 获取所有角色
export function getRolesAll() {
  return request({
    url: `/api/roles/all`,
    method: 'get'
  })
}
// 保存用户
export function saveUsers(data) {
  return request({
    url: `/api/users`,
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUsers(id) {
  return request({
    url: `/api/users/${id}`,
    method: 'delete'
  })
}
// 修改密码-POST
export function setChangePassword(oldPassword, newPassword) {
  return request({
    url: `/api/change_password?oldPassword=${oldPassword}&newPassword=${newPassword}`,
    method: 'post'
  })
}
