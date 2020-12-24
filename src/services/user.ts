import request from '@/utils/request'
import qs from 'qs'

interface User {
  phone: string
  password: string
}

export const login = (params: User) => {
  return request.post('/front/user/login', qs.stringify(params), {
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  })
  // params 是FormData 格式，则 content-type 自动是 multipart/form-data
  // params是普通对象的时候，则content-type是application/json
  // qs.stringify转换后的数据格式 key=value&key=value,则content-type会自动设置为application/x-www-form-urlencoded
}

export const getInfo = () => {
  return request.get('front/user/getInfo')
}
