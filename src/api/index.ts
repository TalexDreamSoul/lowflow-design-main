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



// 分割线api/营销触达
export const dictFilterTree = () => {
    return request.post({ url: '/api/dictFilterTree.do' })
}
// 营销触达节点统计
export const getmarketingTouchEstimate = (data: any) => {
    return request.post({ url: '/api/marketingTouchEstimate.do', data })
}
// 素材列表
export const getQryMaterial = (data: any) => {
    return request.post({ url: '/api/qryMaterial.do', data })
}

// 营销触达列表
export const getqryMarketingTouch = (data: any) => {
    return request.post({ url: '/api/qryMarketingTouch.do', data })
}
// 删除营销触达
export const deleteMarketingTouch = (data: any) => {
    return request.post({ url: '/api/deleteMarketingTouch.do', data })
}

// 营销触达节点统计
export const getqryTouchStatusCount = () => {
    return request.post({ url: '/api/qryTouchStatusCount.do' })
}


// 营销触达暂停
export const getpauseMarketingTouch = (data: any) => {
    return request.post({ url: '/api/pauseMarketingTouch.do', data })
}


// 营销触达开始
export const getstartMarketingTouch = (data: any) => {
    return request.post({ url: '/api/pauseMarketingTouch.do', data })
}

// 删除营销触达
export const getupdateMarketingTouch = (data: any) => {
    return request.post({ url: '/api/updateMarketingTouch.do', data })
}

export const addMaterial = (data: any) => {
    return request.post({
        url: '/api/addMaterial',
        data
    })
}