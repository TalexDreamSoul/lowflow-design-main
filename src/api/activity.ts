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
