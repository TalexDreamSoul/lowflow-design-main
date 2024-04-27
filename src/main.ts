import { createApp } from "vue";
import App from "./App.vue";

import ElementPlus from 'element-plus'

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
import "@antv/x6-vue-shape";

import '~/utils/mention/mention'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'
import 'element-plus/theme-chalk/src/index.scss'

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())

app.use(router);
app.mount("#app");
