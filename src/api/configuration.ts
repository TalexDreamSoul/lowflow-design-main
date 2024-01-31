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
};

export default configAPI;
