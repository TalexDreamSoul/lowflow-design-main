import request from "~/axios";

const customerAPI = {
  qryCustomList(data: any) {
    return request.post({ url: "/api/qryCustomList.do", data });
  },
  addCustom(data: any) {
    return request.post({ url: "/api/addCustom.do", data });
  },
  deleteCustom(data: any) {
    return request.post({ url: "/api/deleteCustom.do", data });
  },
};

export default customerAPI;
