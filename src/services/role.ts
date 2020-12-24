import request from '@/utils/request'

export const saveOrUpdate = (params: object) => {
  return request.post('/boss/role/saveOrUpdate', params)
}

export const getMenuNodeList = () => {
  return request.get('/boss/menu/getMenuNodeList')
}

export const allocateRoleMenus = (params: {roleId: number | string; menuIdList: number[]}) => {
  return request.post('/boss/menu/allocateRoleMenus', params)
}

export const getRoleMenus = (roleId: number | string) => {
  return request.get(`/boss/menu/getRoleMenus?roleId=${roleId}`)
}

export const getAllCategory = () => {
  return request.get('/boss/resource/category/getAll')
}

export const getAllResource = () => {
  return request.get('/boss/resource/getAll')
}

export const getRoleResources = (roleId: number | string) => {
  return request.get(`/boss/resource/getRoleResources?roleId=${roleId}`)
}

export const allocateRoleResources = (params: {resourceIdList: number[]; roleId: number | string}) => {
  return request.post('/boss/resource/allocateRoleResources', params)
}

export const getUserRole = (id: number) => {
  return request.get(`/boss/role/user/${id}`)
}

export const forbidUser = (userId: number) => {
  return request.post('/boss/role/forbidUser', { userId })
}

export const getAllRole = () => {
  return request.get('/boss/role/all')
}

interface AllocateUserRoles {
  userId: number
  roleIdList: Array<number>
}

export const allocateUserRoles = (data: AllocateUserRoles) => {
  return request.post('/boss/role/allocateUserRoles', data)
}
