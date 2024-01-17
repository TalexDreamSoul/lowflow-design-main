import type { RouterOptions } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

export const routes: RouterOptions['routes'] = [
  {
    path: '/',
    redirect: '/design',
  },
  {
    path: '/pinia',
    component: () => import('../../src/views/Pinia/PiniaExample.vue'),
  },
  {
    path: '/design',
    component: () => import('../views/design/index.vue'),
  },
  {
    path: '/dashboard',
    component: () => import('../../src/views/dashboard/index.vue')
  },

  {
    path: '/page',
    component: () => import('../../src/views/pagenull/index.vue')
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
