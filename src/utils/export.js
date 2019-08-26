import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    // get 请求的时候 , 过滤掉空值
    if (config.method === 'get' && config.params) {
      const paramsKey = Object.keys(config.params)
      paramsKey.forEach(key => {
        if (config.params[key] === '' || config.params[key] === undefined) {
          delete config.params[key]
        }
      })
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)
export default service
