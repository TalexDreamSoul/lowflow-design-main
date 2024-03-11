import type { RouterOptions } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

export const routes: RouterOptions["routes"] = [
  {
    path: "/",
    redirect: '/configuration'
    // component: () => import("~/views/dashboard/index.vue"),
  },
  {
    path: '/login',
    component: () => import("~/views/login/login.vue"),
    meta: {
      hideTopMenu: true,
    },},
  {
    path: "/design/:id?",
    component: () => import("~/touch-flow/FlowPage.vue"),
    meta: {
      hideTopMenu: true,
    },
  },
  {
    path: "/tree",
    component: () => import("../flow/index.vue"),
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
        component: () => import("~/pages/configuration/event.vue"),
      },
      {
        path: "attr",
        component: () => import("~/pages/configuration/attr.vue"),
      },
    ],
  },
  {
    path: "/customer",
    redirect: "/customer/list",
    children: [
      {
        path: "list",
        component: () => import("~/pages/customer/list.vue"),
      },
      {
        path: "tag",
        component: () => import("~/pages/customer/tag.vue"),
      },
      {
        path: "blackList",
        component: () => import("~/pages/customer/blacklist.vue"),
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
        component: () => import("~/views/materialCenter/SmsTemplateVue.vue"),
      },
    ],
  },
  {
    path: "/channelManagement",
    redirect: "/channelManagement/transactionList",
    children: [
      {
        path: "transactionList",
        component: () => import("~/views/channelManagement/transactionList.vue"),
      },
      {
        path: "reconciliationList",
        component: () => import("~/views/channelManagement/reconciliationList.vue"),
      },
      {
        path: "equityManagement",
        component: () => import("~/views/channelManagement/equityManagement.vue"),
      },
      {
        path: "channelDisturb",
        component: () => import("~/views/channelManagement/channelDisturb.vue"),
      }
    ],
  },
  {
    path: "/userCenter",
    redirect: "/userCenter/userManagement",
    children: [
      {
        path: "userManagement",
        component: () => import("~/views/userCenter/userManagement.vue"),
      },
      {
        path: "rolesManagement",
        component: () => import("~/views/userCenter/rolesManagement.vue"),
      },
      {
        path: "personalInformation",
        component: () => import("~/views/userCenter/personalInformation.vue"),
      }
    ],
  },
  {
    path: "/activityList",
    component: () => import("~/pages/activity/index.vue"),
  },
  // 添加需要隐藏 TopMenu 的页面，并设置 meta.hideTopMenu 为 true
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
