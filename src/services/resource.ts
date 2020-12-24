import request from '@/utils/request'

export const getAll = () => {
  return request.get('/boss/resource/getAll')
}

export const saveOrUpdate = (params: object) => {
  return request.post('/boss/resource/saveOrUpdate', params)
}

export const getCategoryAll = () => {
  return request.get('/boss/resource/category/getAll')
}

export const deleteCategory = (id: number) => {
  return request.delete(`/boss/resource/category/${id}`)
}

export const saveOrderUpdate = (params: object) => {
  return request.post('/boss/resource/category/saveOrderUpdate', params)
}
