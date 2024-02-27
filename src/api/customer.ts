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
    return request.get({ url: "/api/downloadCustomLabelTemplate", responseType: 'blob', });
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
  addBlacklist(data: any) {
    return request.post({ url: "/api/addBlacklist.do", data });
  },
  blacklistContainCustoms(data: any) {
    return request.post({ url: "/api/blacklistContainCustoms.do", data });
  },
  blacklistDetail(data: any) {
    return request.post({ url: "/api/blacklistDetail.do", data });
  },
  updateBlacklist(data: any) {
    return request.post({ url: "/api/updateBlacklist.do", data });
  },
  addCustomBlacklistRelation(data: any) {
    return request.post({ url: "/api/addCustomBlacklistRelation.do", data });
  },
  deleteCustomBlacklistRelation(data: any) {
    return request.post({ url: "/api/deleteCustomBlacklistRelation.do", data });
  },
};

export default customerAPI;
