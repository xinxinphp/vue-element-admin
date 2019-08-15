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
  return Promise.resolve('out')
}
