/*
 * @Author: 张佳 zhangjia@4paradigm.com
 * @Date: 2024-04-22 10:55:37
 * @LastEditors: 张佳 zhangjia@4paradigm.com
 * @LastEditTime: 2024-04-23 16:14:23
 * @FilePath: /lowflow-design-main-frontend/src/views/activityDetailsList/playConfig.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  1: {
    url: "/playDataCollect",
    children: [
      [
        {
          title: "参与数据",
        },
      ],
    ],
  },
  2: {
    url: "/playDataCollect",
    children: [
      [
        {
          title: "参与数据",
          key: "participationData",
        },
        {
          title: "奖品数据",
          key: "prizeData",
          filter: [{ name: "奖池", key: "prizeJackpotId" }],
        },
      ],
      [
        {
          title: "剩余库存",
          key: "inventoryData",
          filter: [{ name: "奖池", key: "inventoryJackpotId" }],
        },
      ],
    ],
  },
  3: {
    url: "/playDataCollect",
    children: [
      [
        {
          title: "参与数据",
        },
      ],
    ],
  },
  4: {
    url: "/playDataCollect",
    children: [
      [
        {
          title: "参与数据",
        },
      ],
    ],
  },
  5: {
    url: "/playDataCollect",
    children: [
      [
        {
          title: "参与数据",
          key: "participationData",
        },
        {
          title: "奖品数据",
          key: "prizeData",
        },
      ],
      [
        {
          title: "剩余库存",
          key: "inventoryData",
        },
      ],
    ],
  },
  6: {
    url: "/playDataCollect",
    children: [
      [
        {
          title: "参与数据",
        },
      ],
    ],
  },
};
