import type { RouterOptions } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

export const routes: RouterOptions["routes"] = [
  {
    path: "/",
    redirect: '/configuration'
    // component: () => import("../views/dashboard/index.vue"),
  },
  {
    path: "/designNew",
    component: () => import("../touch-flow/FlowPage.vue"),
    meta: {
      hideTopMenu: true,
    },
  },
  {
    path: "/strategyProcess",
    redirect: "/strategyProcess/List",
    children: [
      {
        path: "List",
        component: () => import("~/touch-flow/strategyProcessList/strategyProcessList.vue"),
      },
      {
        path: "details/:id",
        component: () => import("~/touch-flow/strategyProcessList/details.vue"),
      },
    ],
  },

  {
    path: "/configuration",
    redirect: "/configuration/event",
    children: [
      {
        path: "event",
        component: () => import("../pages/configuration/event.vue"),
      },
      {
        path: "attr",
        component: () => import("../pages/configuration/attr.vue"),
      },
    ],
  },
  {
    path: "/customer",
    redirect: "/customer/list",
    children: [
      {
        path: "list",
        component: () => import("../pages/customer/list.vue"),
      },
      {
        path: "attr",
        component: () => import("../pages/configuration/attr.vue"),
      },
    ],
  },
  // * 素材类型：sms 短信，app app消息，digital 数字员工，outbound 智能外呼，znx 站内信
  {
    path: "/materialCenter",
    redirect: "/materialCenter/SmsTemplateVue",
    children: [
      {
        path: "templatePanel/:type",
        component: () => import("../views/materialCenter/SmsTemplateVue.vue"),
      },
    ],
  },
  // 添加需要隐藏 TopMenu 的页面，并设置 meta.hideTopMenu 为 true
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
