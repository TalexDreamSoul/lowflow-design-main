import request from "~/axios";
// 渠道管理
const customerAPI = {
  // 新增权益
  addEquity(data: any) {
    return request.post({ url: "/api/addEquity.do", data });
  },

  // 删除权限
  deleteEquity(data: any) {
    return request.post({ url: "/api/deleteEquity.do", data });
  },
  
  // 权益详情
  equityDetail(data: any) {
    return request.post({ url: "/api/equityDetail.do", data });
  },
  // 勿扰设置详情
  globalDisturbDetail(data: any) {
    return request.post({ url: "/api/globalDisturbDetail.do", data });
  },
  
  // 忽略错误交易
  ignoreTrsRecord(data: any) {
    return request.post({ url: "/api/ignoreTrsRecord.do", data });
  },
  // 权益搜索
  qryEquityBySkuCode(data: any) {
    return request.post({ url: "/api/qryEquityBySkuCode.do", data });
  },
  // 权益列表
  qryEquityList(data: any)  {
    return request.post({ url: "/api/qryEquityList.do", data });
  },
  // 交易误差详情
  qryNqTrsList(data: any) {
    return request.post({ url: "/api/qryNqTrsList.do", data});
  },
  // 交易对账
  qryTrsCheckList(data: any) {
    return request.post({ url: "/api/qryTrsCheckList.do", data });
  },
  // 交易明细
  qryTrsRecordList(data: any) {
    return request.post({ url: "/api/qryTrsRecordList.do", data });
  },
  // 更新权益
  updateEquity(data: any) {
    return request.post({ url: `/api/updateEquity.do`, data });
  },
  // 权益上下线
  updateEquityStatus(data: any) {
    return request.put({ url: "/api/updateEquityStatus.do", data });
  },
  // 更新勿扰设置
  updateGlobalDisturb(data: any) {
    return request.put({ url: "/api/updateGlobalDisturb.do", data });
  },

};

export default customerAPI;
