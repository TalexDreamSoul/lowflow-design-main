import request from "~/axios";

const configAPI = {
  qryEventDict(data: any) {
    return request.post({ url: "/api/qryEventDict.do", data });
  },
  addEventDict(data: any) {
    return request.post({ url: "/api/addEventDict.do", data });
  },
  updateEventDict(data: any) {
    return request.post({ url: "/api/updateEventDict.do", data });
  },
  deleteEventDict(data: any) {
    return request.post({ url: "/api/deleteEventDict.do", data });
  },
  qryAttrDict(data: any) {
    return request.post({ url: "/api/qryAttrDict.do", data });
  },
  addAttrDict(data: any) {
    return request.post({ url: "/api/addAttrDict.do", data });
  },
  updateAttrDict(data: any) {
    return request.post({ url: "/api/updateAttrDict.do", data });
  },
};

export default configAPI;
