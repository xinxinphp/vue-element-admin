import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/auth',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/authorities',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/authorities', // 使用的是info接口,应该有个退出接口
    method: 'get'
  })
}
