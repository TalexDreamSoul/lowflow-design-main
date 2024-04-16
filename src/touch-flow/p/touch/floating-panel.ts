import { createApp, watchEffect, Ref, ref } from 'vue'
import { computePosition, MaybeElement, useFloating, offset, flip, shift } from '@floating-ui/vue';

export function createFloatingPanel(reference: HTMLElement, render: any) {
  let disposed_flag = false

  const app = createApp(render)

  const wrapper = document.createElement('div')

  const targetClasses = ['TouchLabel', 'TouchSettingsContent', 'TouchFloating']

  function handleClick(e: Event) {
    const res = e.composedPath().find((el: any) => targetClasses.some((c) => el?.className?.indexOf?.(c) !== -1))

    if (!res || res === document) {
      dispose()
    }

  }

  // @ts-ignore exist
  window.__clickListen = handleClick
  document.body.addEventListener('click', handleClick)

  Object.assign(wrapper.style, {
    zIndex: '1000000',
    position: 'absolute',
    transition: '.15s',
    opacity: '0',
    transform: 'translateY(10%)'
  })

  const dispose = () => {
    if (disposed_flag) return

    disposed_flag = true

    document.body.removeEventListener('click', handleClick)

    app.unmount()

    document.body.removeChild(wrapper)
  }

  wrapper.className = 'TouchFloating'

  computePosition(reference, wrapper).then(({ x, y }) => {
    wrapper.style.left = `${x}px`
    wrapper.style.top = `${y}px`
  })
  // const { floatingStyles } = useFloating(reference, wrapperRef as any, {
  //   placement: 'bottom',
  //   middleware: [offset(10), flip(), shift()]
  // })

  // watchEffect(() => {
  //   Object.assign(wrapper.style, floatingStyles.value)

  //   console.log("R", floatingStyles.value)
  // })

  document.body.appendChild(wrapper)

  // console.log(floatingStyles, wrapper)

  app.mount(wrapper)

  setTimeout(() => {
    Object.assign(wrapper.style, {
      opacity: '1',
      transform: 'translateY(0%)'
    })
  }, 100)

  return dispose
}