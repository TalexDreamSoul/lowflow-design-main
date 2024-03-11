import BaseMention from './BaseMention.vue'
import { createPopover } from '../touch-templates'
import { Ref, ref } from 'vue'
import { throttledRef, debouncedRef } from "@vueuse/core";

export function message(title: Ref<string>, content: Ref<string>, loading: Ref<boolean>, countdown: Ref<number>, show: Ref<boolean>) {
  return createPopover(BaseMention, {
    title,
    content,
    loading,
    countdown,
    show
  })
}

export function reactiveMessage(title: string = '', content: string = '', loading: boolean = false, countdown: number = -1, show: boolean = true): [any, {
  title: Ref<string>,
  content: Ref<string>,
  loading: Ref<boolean>,
  countdown: Ref<number>,
  show: Ref<boolean>
}] {
  const _title = ref(title)
  const _content = ref(content)
  const _loading = ref(loading)
  const _countdown = ref(countdown)
  const _show = ref(show)

  return [message(_title, _content, _loading, _countdown, _show), {
    title: _title,
    content: _content,
    loading: _loading,
    countdown: _countdown,
    show: _show
  }]
}