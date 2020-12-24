// import axios from 'axios'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { Message } from 'element-ui'
import config from '../config/config'
import store from '@/store'
import qs from 'qs'
import router from '@/router'

const baseURL = 'http://edufront.lagou.com'
export const request = axios.create({
  // 配置选项
  baseURL,
  timeout: config.timeout // 请求超时时间
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({ // 创建一个新的 axios 实例发送请求，因为如果使用request会可能发生 401 死循环
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      // refreshtoken 只能使用一次,第二次会报错不存在了
      refreshtoken: store.state.user.user.refresh_token
    })
  })
}

interface Error {
  response?: {
    status?: number
  }
  config?: object
  request?: any
  message?: string
}
let isRefreshing = false // 控制刷新 token 的状态,避免重复刷新
let requests: (() => void)[] = [] // 存储刷新 token 期间过来的 401 请求
const err = async (error: Error) => { // 超过 2xx 状态码都在这里
  // 如果使用的 HTTP 状态码，错误处理就写到这里
  console.dir(error)
  if (error.response) { // 请求收到响应了，但是状态码超过了 2xx 范围
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token 无效 （没有提供 token, token 是无效的, token 过期了）
      // 如果有 refresh_token 则尝试使用 refresh_token 获取新的 access_token
      if (!store.state.user.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      if (!isRefreshing) { // 解决多次请求重新刷新 Token 的问题
        isRefreshing = true
        // 尝试刷新获取新的 token
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新 Token 失败')
          }
          // 成功了 -> 把本次失败的请求重新发出去
          // 把成功刷新拿到的 access_token 更新到容器和本地存储中
          store.commit('SET_USER', res.data.content)
          // 把本地失败的请求重新发出去
          requests.forEach(cb => cb())
          requests = [] // 重置 requests 数组
          return request(error.config as object) // 失败请求的配置信息
        }).catch(err => {
          // 把当前登录用户状态清除
          store.commit('SET_USER', null)
          // 失败了 -> 直接去跳转到登录页
          redirectLogin()
          return Promise.reject(err)
        }).finally(() => {
          isRefreshing = false
        })
      }
      // 刷新状态的同时，把其他请求挂起，放到 requests 数组中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config as object))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status as number >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) { // 请求发出去了，但是没有收到响应（请求超时，网络断开）
    Message.error('请求超时，请刷新重试')
  } else { // 在设置请求时发生了一些事情，触发了一个错误
    Message.error('请求失败: ' + error.message)
  }
  return Promise.reject(error)// 把请求失败的错误对象继续抛出，扔给下一个调用者
}
// 请求拦截器
request.interceptors.request.use((config: AxiosRequestConfig) => {
  const { user } = store.state.user
  if (user && user.access_token) {
    const token = user.access_token
    config.headers.Authorization = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use((response: AxiosResponse) => {
  // 后端错误提示码自定义就写在这里
  // let data = response.data
  // switch (data.code) {
  //   case 405:
  //     notification.error({ message: '系统提示', description: data.message,duration: 4})
  //     break
  //   case 500:
  //     notification.error({ message: '系统提示', description: data.message,duration: 4})
  //       break
  //   default:
  //     break
  // }
  return response.data
}, err)

interface ConfigRequest {
  // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
  // 如果 data 是 qs.stringify(data) 格式，则 content-type 是 application/x-www-form-urlencoded
  // 如果 data 是 json 格式，则 content-type 是 application/json
  // 如果 data 是FormData 格式，则 content-type 是 multipart/form-data
  headers?: {
    'content-type': string
  }
  onUploadProgress?: (progressEvent: ProgressEvent) => void
}

export default {
  get (url: string, params?: string | object) {
    return request.get(url, { params: params })
  },
  post (
    url: string,
    postData?: object | string,
    config?: ConfigRequest
  ) {
    return request.post(url, postData, config)
  },
  put (
    url: string,
    postData: object | string
  ) {
    return request.put(url, postData)
  },
  delete (url: string) {
    return request.delete(url)
  }
}
