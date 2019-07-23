import request from '@/utils/request'

export function getToken(data) {
  return request({
    url: '/api/auth', // 假地址 自行替换
    method: 'post',
    data
  })
}
