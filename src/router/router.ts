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
    },
  },
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
    path: "/touchCenter",
    redirect: "/touchCenter/List",
    children: [
      {
        path: "touchList",
        component: () => import("~/touch-flow/strategyProcessList/strategyProcessList.vue"),
      },
      {
        path: "details/:id",
        component: () => import("~/touch-flow/strategyProcessList/details.vue"),
      },
    ],
  },

  {
    path: "/dictCenter",
    redirect: "/dictCenter/event",
    children: [
      {
        path: "eventDict",
        component: () => import("~/pages/configuration/event.vue"),
      },
      {
        path: "attrDict",
        component: () => import("~/pages/configuration/attr.vue"),
      },
    ],
  },
  {
    path: "/customCenter",
    redirect: "/customCenter/list",
    children: [
      {
        path: "customList",
        component: () => import("~/pages/customer/list.vue"),
      },
      {
        path: "customLabel",
        component: () => import("~/pages/customer/tag.vue"),
      },
      {
        path: "customBlacklist",
        component: () => import("~/pages/customer/blacklist.vue"),
      },
    ],
  },
  // * 素材类型：sms 短信，app app消息，digital 数字员工，outbound 智能外呼，znx 站内信
  {
    path: "/materialCenter",
    redirect: "/materialCenter/smsTemplate",
    children: [
      {
        path: ":type",
        component: () => import("~/views/materialCenter/MaterialCenterIndex.vue"),
      },
    ],
  },
  {
    path: "/channelCenter",
    redirect: "/channelCenter/transactionList",
    children: [
      {
        path: "trsDetail",
        component: () => import("~/views/channelManagement/transactionList.vue"),
      },
      {
        path: "trsCheck",
        component: () => import("~/views/channelManagement/reconciliationList.vue"),
      },
      {
        path: "equityManage",
        component: () => import("~/views/channelManagement/equityManagement.vue"),
      },
      {
        path: "globalDisturb",
        component: () => import("~/views/channelManagement/channelDisturb.vue"),
      }
    ],
  },
  {
    path: "/userCenter",
    redirect: "/userCenter/userManagement",
    children: [
      {
        path: "userManage",
        component: () => import("~/views/userCenter/userManagement.vue"),
      },
      {
        path: "roleManage",
        component: () => import("~/views/userCenter/rolesManagement.vue"),
      },
      {
        path: "userDetail",
        component: () => import("~/views/userCenter/personalInformation.vue"),
      }
    ],
  },
  {
    path: "/approve",
    redirect: "/approve/activity",
    children: [
      {
        path: "activity",
        component: () => import("~/pages/approve/activity.vue"),
      },
      {
        path: 'strategyProcess',
        component: () => import("~/pages/approve/strategyProcess.vue"),
      },
      {
        path: 'configuration',
        component: () => import("~/pages/approve/configuration.vue"),
      }
    ],
  },
  {
    path: "/activityCenter/activityList",
    component: () => import("~/pages/activity/index.vue"),
  },
  // 添加需要隐藏 TopMenu 的页面，并设置 meta.hideTopMenu 为 true
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
