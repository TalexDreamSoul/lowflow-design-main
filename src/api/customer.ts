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
  qryCustomLabel(data: any) {
    return request.post({ url: "/api/qryCustomLabel.do", data });
  },
  customDetail(data: any) {
    return request.post({ url: "/api/customDetail.do", data });
  },
  updateCustomLabelStatus(data: any) {
    return request.post({ url: "/api/updateCustomLabelStatus.do", data });
  },
  deleteCustomLabel(data: any) {
    return request.post({ url: "/api/deleteCustomLabel.do", data });
  },
  downloadCustomLabelTemplate() {
    return request.get({ url: "/api/downloadCustomLabelTemplate.do" });
  },
  updateCustomLabel(data: any) {
    return request.post({ url: "/api/updateCustomLabel.do", data });
  },
  customLabelDetail(data: any) {
    return request.post({ url: "/api/customLabelDetail.do", data });
  },
  qryBlacklist(data: any) {
    return request.post({ url: "/api/qryBlacklist.do", data });
  },
  updateCustomBlacklistStatus(data: any) {
    return request.post({ url: "/api/updateCustomBlacklistStatus.do", data });
  },
  deleteBlacklist(data: any) {
    return request.post({ url: "/api/deleteBlacklist.do", data });
  },
};

export default customerAPI;
