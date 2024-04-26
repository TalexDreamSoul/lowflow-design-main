import request from "~/axios";
// 活动列表
export const pageActivityList = (data: any)=> {
  return request.post({ url: "/api/pageActivityList.do", data });
}
// 保存or删除  模板
export const saveActivityTemplate = (data:any)=> {
  return request.post({ url: "/api/saveActivityTemplate.do", data });
}
interface ActivityTemplate {  
  id: number;  
  name: string;  
  description: string;  
  // 可以添加其他属性...  
} 
// 删除活动
export const deleteActivityInfo = (data:any)=> {
  return request.post({ url: "/api/deleteActivityInfo.do", data });
}

// 查询模板列表
export const listActivityTemplate = ():Promise<any>=> {
  return request.post({ url: "/api/listActivityTemplate.do" });
}

// 查询ip host
export const queryDict = ():Promise<any>=> {
  return request.get({ url: "/api/queryDict.do",params:{ dictKey: 'frontEndDomain'} });
}

export const getPlayData = (url: string, data: any) => {
  return request.post({ url: `/api/${url}.do`, data });
}

export const getBrowseData = (data: any) => {
  return request.post({ url: `/api/pageBrowseData.do`, data });
}

export const getClickButtonData = (data: any) => {
  return request.post({ url: `/api/pageClickButtonData.do`, data });
}

export const queryActivityForm = (data: any) => {
  return request.post({ url: `/api/queryActivityForm.do`, data });
}

export const getFormCustomData = (data: any) => {
  return request.post({ url: `/api/pageFormCustomData.do`, data });
}

export const formConversionData = (data: any) => {
  return request.post({ url: `/api/formConversionData.do`, data });
}

export const listActivityPlay = (data: any) => {
  return request.post({ url: `/api/listActivityPlay.do`, data });
}

export const queryLotteryJackpot = (data: any) => {
  return request.post({ url: `/api/queryLotteryJackpot.do`, data });
}

export const playCustomData = (data: any) => {
  return request.post({ url: `/api/playCustomData.do`, data });
}

export const exportBrowseData = (data: any) => {
  return request.post({ url: `/api/exportBrowseData.do`, data, responseType: 'blob', });
}

export const exportClickButtonData = (data: any) => {
  return request.post({ url: `/api/exportClickButtonData.do`, data, responseType: 'blob', });
}

export const exportFormCustomData = (data: any) => {
  return request.post({ url: `/api/exportFormCustomData.do`, data, responseType: 'blob', });
}

export const playCustomDataExport = (data: any) => {
  return request.post({ url: `/api/playCustomDataExport.do`, data, responseType: 'blob', });
}

// 结束活动
export const finishActivity = (data:any)=> {
  return request.post({ url: "/api/finishActivity.do", data });
}
// 复制活动
export const copyActivity = (data:any)=> {
  return request.post({ url: "/api/copyActivity.do", data });
}
