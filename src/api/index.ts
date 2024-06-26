import request from "~/axios";

export interface Role {
  id: string;
  name: string;
}

function genDictFileTree() {

  function _req(data: any) {
    return request.post({ url: "/api/dictFilterTree.do", data });
  }

  const cache = new Map<string, any>();

  return (data: any = {
    pageNum: "1",
    pageSize: "999"
  }): Promise<any> => {
    return new Promise(resolve => {
      const key = JSON.stringify(data);
      if (cache.has(key)) {
        const { time, value } = cache.get(key);
        if (Date.now() - time < 1000 * 60) {
          resolve(value);
          return;
        }
      }

      _req(data).then((res: any) => {
        cache.set(key, {
          time: Date.now(),
          value: res
        });

        resolve(res)
      })
    })
  }
}

// 分割线api/营销触达
export const dictFilterTree = genDictFileTree();

// 营销触达节点统计
export const getmarketingTouchEstimate = (data: any) => {
  return request.post({ url: "/api/marketingTouchEstimate.do", data });
};
// 营销触达列表
export const getqryMarketingTouch = (data: any) => {
  return request.post({ url: "/api/qryMarketingTouch.do", data });
};
// 删除营销触达
export const deleteMarketingTouch = (data: any) => {
  return request.post({ url: "/api/deleteMarketingTouch.do", data });
};

// 营销触达节点统计
export const getqryTouchStatusCount = () => {
  return request.post({ url: "/api/qryTouchStatusCount.do" });
};
// 营销触达节点统计
export const marketingTouchStatistics = (data: any) => {
  return request.post({ url: "/api/marketingTouchStatistics.do", data });
};

// 营销触达暂停
export const getpauseMarketingTouch = (data: any) => {
  return request.post({ url: "/api/pauseMarketingTouch.do", data });
};
// 营销触达列表审核通过
export const updateMarketingTouchStatus = (data: any) => {
  return request.post({ url: "/api/updateMarketingTouchStatus.do", data });
};

// 营销触达节点触达客户
export const qryNodeTouchCustom = (data: any) => {
  return request.post({ url: "/api/qryNodeTouchCustom.do", data });
};

// 复制
export const copyMarketingTouch = (data: any) => {
  return request.post({ url: "/api/copyMarketingTouch.do", data });
};

// 营销触达开始
export const getstartMarketingTouch = (data: any) => {
  return request.post({ url: "/api/startMarketingTouch.do", data });
};

// 营销触达详情
export const getmarketingTouchDetail = (data: any) => {
  return request.post({ url: "/api/marketingTouchDetail.do", data });
};
// 删除营销触达
export const getupdateMarketingTouch = (data: any) => {
  return request.post({ url: "/api/updateMarketingTouch.do", data });
};

// 素材列表
export const getQryMaterial = (data: any) => {
  return request.post({ url: "/api/qryMaterial.do", data });
};

// 上线素材
export const setOnlineMaterial = (data: any) => {
  return request.post({ url: "/api/onlineMaterial.do", data });
};

// 下线素材
export const setOfflineMaterial = (data: any) => {
  return request.post({ url: "/api/offlineMaterial.do", data });
};

// 删除素材
export const setDeleteMaterial = (data: any) => {
  return request.post({ url: "/api/deleteMaterial.do", data });
};

// 素材详情
export const getMaterialDetail = (data: any) => {
  return request.post({ url: "/api/materialDetail.do", data });
};

// 修改素材状态
export const setUpdateMaterialStatus = (data: any) => {
  return request.post({ url: "/api/updateMaterialStatus.do", data });
};

// 字典查询
export const queryDict = (dictKey: string): Promise<any> => {
  return request.get({ url: `/api/queryDict.do?dictKey=${dictKey}` });
}

export const addMaterial = (data: any) => {
  return request.post({
    url: "/api/addMaterial.do",
    data,
  });
};

export const updateMarketingTouch = (_data: any) => {
  const data = _data


  return request.post({
    url: "/api/updateMarketingTouch.do",
    data,
  });
};
export const addMarketingTouch = (data: any) => {
  return request.post({
    url: "/api/addMarketingTouch.do",
    data,
  });
};
export const updateMaterial = (data: any) => {
  return request.post({
    url: "/api/updateMaterial.do",
    data,
  });
};

export const addCustomLabel = (data: {
  labelValueType: string;
  labelValue: {
    data: string[];
  };
  labelName: string;
}) => {
  const defaultVal = {
    labelValueType: "",
    labelValue: {
      data: [],
    },
    labelName: "",
  };

  return request.post({
    url: "/api/addCustomLabel.do",
    data: {
      ...defaultVal,
      ...data,
    },
  });
};

export const getLabelList = (data?: {
  beginTime?: string;
  endTime?: string;
  labelName: string;
  labelSource: string;
  labelType: string;
  pageNum?: number;
  pageSize?: number;
}) => {
  const defaultVal = {
    beginTime: "",
    endTime: "",
    labelName: "",
    labelSource: "",
    labelType: "",
    pageNum: 0,
    pageSize: 10,
  };

  Object.assign(defaultVal, data);

  return request.post({
    url: "/api/qryCustomLabel.do",
    data: defaultVal,
  });
};

export const getBlackList = (data: {
  beginTime?: string;
  endTime?: string;
  pageNum?: number;
  pageSize?: number;
  blacklistName?: string;
  blacklistSource?: string;
  blacklistType?: string;
  id?: string;
}) => {
  const defaultVal = {
    beginTime: "",
    blacklistName: "",
    blacklistSource: "",
    blacklistType: "",
    endTime: "",
    id: 0,
    pageNum: 0,
    pageSize: 10,
  };

  Object.assign(defaultVal, data);

  return request.post({
    url: "/api/qryBlacklist.do",
    data: defaultVal,
  });
};

export const marketingTouchNodeStatistics = (data: any = {
  id: 0,
  pageNum: 1,
  pageSize: 10,
  touchNodeId: 0
}) => {
  return request.post({
    url: "/api/marketingTouchNodeStatistics.do",
    data,
  });
}

export const getQryNqList = (data: any = {
  pageNum: 1,
  pageSize: 10,
  trsDate: ""
}) => {
  return request.post({
    url: "/api/qryNqTrsList.do",
    data
  })
}

export const getGlobalDisturbDetail = (data: any) => {
  return request.post({
    url: '/api/globalDisturbDetail.do',
    data
  })
}