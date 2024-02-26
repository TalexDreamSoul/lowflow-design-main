import { createApp, Component, Ref } from "vue";
import BaseTemplateVue from "./templates/BaseTemplate.vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import ZnxTemplateVue from "./templates/ZnxTemplate.vue";
import SmsTemplateVue from "./templates/SmsTemplateVue.vue";
import AppTemplateVue from "./templates/AppTemplateVue.vue";
import DigitalTemplateVue from "./templates/DigitalTemplateVue.vue";
import OutboundTemplateVue from "./templates/OutboundTemplateVue.vue";
// * 素材类型：sms 短信，app app消息，digital 数字员工，outbound 智能外呼，znx 站内信
const templates = {
  znx: ZnxTemplateVue,
  sms: SmsTemplateVue,
  appPush: AppTemplateVue,
  digital: DigitalTemplateVue,
  outbound: OutboundTemplateVue,
};

function _createApp(comp: Component, props: any) {
  const app = createApp(comp, props);

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }

  return app;
}

export function createTemplatePopover(
  title: string,
  template: keyof typeof templates,
  data?: Ref<any>,
  type?: String,
  readonly?: boolean
) {
  const comp = templates[template];
  if (!comp) throw new Error(`Template ${template} not found!`);

  let __resolve: any;

  function resolve() {
    if (!__resolve) {
      throw new Error("Promise resolve fatal error!");
    }

    __resolve();

    window.addEventListener("scroll", handleScroll);

    app.unmount();

    document.body.removeChild(dom);
  }

  window.addEventListener("scroll", handleScroll);

  const dom = document.createElement("div");
  const app = _createApp(BaseTemplateVue, {
    title,
    comp,
    close: resolve,
    data,
    type,
    readonly,
    success: (val: any) => {
      Object.assign(data?.value, val);
    },
  });

  function handleScroll(e: Event) {
    e.preventDefault();
  }

  Object.assign(dom.style, {
    zIndex: "1000",
    position: "absolute",
    width: "100%",
    height: "100%",
    left: "0",
    top: "0",
    backgroundColor: "rgba(0, 0, 0, .5)",
  });

  document.body.appendChild(dom);
  app.mount(dom);

  return new Promise((resolve) => {
    __resolve = resolve;
  });
}
