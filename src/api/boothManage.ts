import request from "~/axios";

const boothManageAPI = {
  pageBoothConf(data: any) {
    return request.post({ url: "/api/pageBoothConf.do", data });
  },
  updateBoothConf(data: any) {
    return request.post({ url: "/api/updateBoothConf.do", data });
  },
  getBoothConf(data: any) {
    return request.post({ url: "/api/getBoothConf.do", data });
  },
  SaveBoothConf(data: any) {
    return request.post({ url: "/api/SaveBoothConf.do", data });
  },
};

export default boothManageAPI;