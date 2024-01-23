import { createApp } from "vue";
import App from "./App.vue";

import "~/styles/index.scss";
import "uno.css";

// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/message.scss";
import "element-plus/theme-chalk/src/notification.scss";
import "element-plus/theme-chalk/el-input-number.css";
// import router from '~/router/index'
import router from '../src/router/router'
import { createPinia } from 'pinia'

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

// 在创建应用程序实例时添加全局属性
app.config.globalProperties.$hideTopMenu = false;
// 在导航守卫中检查是否需要隐藏 TopMenu
router.beforeEach((to, from, next) => {
  // 如果页面需要隐藏 TopMenu，则设置 hideTopMenu 标记
  app.config.globalProperties.$hideTopMenu = to.meta.hideTopMenu || false;

  next();
});
app.use(createPinia())

app.use(router);
app.mount("#app");
