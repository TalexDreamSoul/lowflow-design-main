import request from "~/axios";

export const pageActivityList = (data: any)=> {
  return request.post({ url: "/api/pageActivityList.do", data });
}

export const saveActivityTemplate = (data:any)=> {
  return request.post({ url: "/api/saveActivityTemplate.do", data });
}

