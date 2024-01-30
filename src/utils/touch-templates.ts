import { createApp, Component } from 'vue'
import BaseTemplateVue from './templates/BaseTemplate.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import ZnxTemplateVue from './templates/ZnxTemplate.vue'

const templates = {
  znx: ZnxTemplateVue
}

function _createApp(comp: Component, props: any) {
  const app = createApp(comp, props)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  return app
}

export function createTemplatePopover(title: string, template: keyof typeof templates) {
  const comp = templates[template]
  if (!comp) throw new Error(`Template ${template} not found!`)

  let __resolve: any

  function resolve() {
    if (!__resolve) {
      throw new Error('Promise resolve fatal error!')
    }

    __resolve()

    window.addEventListener('scroll', handleScroll)

    app.unmount()

    document.body.removeChild(dom)
  }

  window.addEventListener('scroll', handleScroll)

  const dom = document.createElement('div')
  const app = _createApp(BaseTemplateVue, {
    title, comp, close: resolve
  })

  function handleScroll(e: Event) {
    e.preventDefault()
  }

  Object.assign(dom.style, {
    zIndex: '1000',
    position: 'absolute',
    width: "100%",
    height: "100%",
    left: '0',
    top: '0',
    backgroundColor: 'rgba(0, 0, 0, .5)'
  })

  document.body.appendChild(dom)
  app.mount(dom)

  return new Promise((resolve) => {
    __resolve = resolve
  })
}