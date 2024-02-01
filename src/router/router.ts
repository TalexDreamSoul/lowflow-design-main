import type { RouterOptions } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

export const routes: RouterOptions["routes"] = [
  {
    path: "/",
    component: () => import("../views/dashboard/index.vue"),
  },
  {
    path: "/pinia",
    component: () => import("../views/Pinia/PiniaExample.vue"),
    meta: {
      hideTopMenu: true,
    },
  },
  {
    path: "/dashboard",
    component: () => import("../views/dashboard/index.vue"),
    meta: {
      hideTopMenu: true,
    },
  },

  {
    path: "/page",
    component: () => import("../views/pagenull/index.vue"),
    meta: {
      hideTopMenu: true,
    },
  },
  {
    path: "/designNew",
    component: () => import("../touch-flow/FlowPage.vue"),
    meta: {
      hideTopMenu: true,
    },
  },
  {
    path: "/strategyProcessList",
    component: () =>
      import("../touch-flow/strategyProcessList/strategyProcessList.vue"),
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
  // * 素材类型：sms 短信，app app消息，digital 数字员工，outbound 智能外呼，znx 站内信
 
  {
    path: "/materialCenter",
    redirect: "/materialCenter/SmsTemplateVue",
    children: [
      {
        path: "SmsTemplateVue",
        component: () => import("../materialCenter/SmsTemplateVue.vue"),
      },
      {
        path: "ZnxTemplateVue",
        component: () => import("../materialCenter/ZnxTemplateVue.vue"),
      },
      {
        path: "AppTemplateVue",
        component: () => import("../materialCenter/AppTemplateVue.vue"),
      },
      {
        path: "DigitalTemplateVue",
        component: () => import("../materialCenter/DigitalTemplateVue.vue"),
      },
      {
        path: "OutboundTemplateVue",
        component: () => import("../materialCenter/OutboundTemplateVue.vue"),
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
