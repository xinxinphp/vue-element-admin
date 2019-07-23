import request from '@/utils/request'

export function login(data) {
  console.log('登入 登陆接口')
  return request({
    url: '/api/auth',
    method: 'post',
    data
  })
}

export function getInfo() {
  console.log('getInfo 接口')
  return request({
    url: '/api/authorities',
    method: 'get'
  })
}

export function logout() {
  console.log('登出 接口')
  return request({
    url: '/api/authorities', // 使用的是info接口,应该有个退出接口
    method: 'get'
  })
}
