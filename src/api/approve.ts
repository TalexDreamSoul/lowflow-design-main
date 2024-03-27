import request from "~/axios";

const approveAPI = {
  listApproveRecord(data: any) {
    return request.post({ url: "/api/listApproveRecord.do", data });
  },
  approve(data: any) {
    return request.post({ url: "/api/approve.do", data });
  },
  getApproveConf(data: any) {
    return request.post({ url: "/api/getApproveConf.do", data });
  },
  pageApproveConf(data: any) {
    return request.post({ url: "/api/pageApproveConf.do", data });
  },
  updateApproveConf(data: any) {
    return request.post({ url: "/api/updateApproveConf.do", data });
  },
  listAccount() {
    return request.post({ url: "/api/listAccount.do" });
  },
};

export default approveAPI;