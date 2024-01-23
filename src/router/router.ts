import type { RouterOptions } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export const routes: RouterOptions['routes'] = [
  {
    path: '/',
    redirect: '/designNew',
  },
  {
    path: '/pinia',
    component: () => import('../views/Pinia/PiniaExample.vue'),
    meta: {
      hideTopMenu: true,
    },
  },
  {
    path: '/design',
    component: () => import('../views/design/index.vue'),
  },
  {
    path: '/dashboard',
    component: () => import('../views/dashboard/index.vue'),
    meta: {
      hideTopMenu: true,
    },
  },

  {
    path: '/page',
    component: () => import('../views/pagenull/index.vue'),
    meta: {
      hideTopMenu: true,
    },
  },

  {
    path: '/designNew',
    component: () => import('../touch-flow/FlowPage.vue'),

  }
  // 添加需要隐藏 TopMenu 的页面，并设置 meta.hideTopMenu 为 true
]


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
