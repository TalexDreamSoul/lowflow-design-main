import request from '~/axios'

export interface Role {
    id: string,
    name: string
}

/**
 * 获取角色信息
 * @param id
 */
export const getById = (id: string) => {
    return request.get<Role>(`/role/info`, { id: id })
}



export interface User {
    id: string,
    username: string,
    name: string,
    avatar: string
}

/**
 * 获取用户信息
 * @param username
 */
export const getByUsername = (username: string) => {
    return request.get<User>(`/user/info`, { username: username })
}

/**
 * 查询角色列表
 */
export const getList = (roleIds?: string[]) => {
    const params = roleIds ? { roleIds: roleIds } : {}
    return request.post<Role[]>('/role/list', params)
}

import { DepartmentListResponse, DepartmentUserParams, DepartmentUserResponse } from './types'

export const getDepartmentApi = () => {
    return request.get<DepartmentListResponse>({ url: '/mock/department/list' })
}

export const getUserByIdApi = (params: DepartmentUserParams) => {
    return request.get<DepartmentUserResponse>({ url: '/mock/department/users', params })
}

export const dictFilterTree = () => {
    return request.post({ url: '/api/dictFilterTree.do'})
}

export const saveUserApi = (data: any) => {
    return request.post({ url: '/mock/department/user/save', data })
}

export const saveDepartmentApi = (data: any) => {
    return request.post({ url: '/mock/department/save', data })
}

export const deleteDepartmentApi = (ids: string[] | number[]) => {
    return request.post({ url: '/mock/department/delete', data: { ids } })
}

export const getDepartmentTableApi = (params: any) => {
    return request.get({ url: '/mock/department/table/list', params })
}
