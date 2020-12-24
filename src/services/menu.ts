import request from '@/utils/request'

export const getEditMenuInfo = (id: string | number = -1) => {
  return request.get(`/boss/menu/getEditMenuInfo?id=${id}`)
}

export const createOrUpdate = (form: object) => {
  return request.post('/boss/menu/saveOrUpdate', form)
}

export const getAllMenus = () => {
  return request.get('/boss/menu/getAll')
}

export const deleteMenu = (id: number) => {
  return request.delete(`/boss/menu/${id}`)
}
