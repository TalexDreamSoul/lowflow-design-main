import request from "~/axios";
// 活动列表
export const pageActivityList = (data: any)=> {
  return request.post({ url: "/api/pageActivityList.do", data });
}
// 保存or删除  模板
export const saveActivityTemplate = (data:any)=> {
  return request.post({ url: "/api/saveActivityTemplate.do", data });
}
// 删除活动
export const deleteActivityInfo = (data:any)=> {
  return request.post({ url: "/api/deleteActivityInfo.do", data });
}
