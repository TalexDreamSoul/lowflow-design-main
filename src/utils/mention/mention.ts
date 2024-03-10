import BaseMention from './BaseMention.vue'
import { createPopover } from '../touch-templates'
import { Ref, ref } from 'vue'

export function message(title: Ref<string>, content: Ref<string>, loading: Ref<boolean>) {
  return createPopover(BaseMention, {
    title,
    content,
    loading
  })
}

export function reactiveMessage(title: string = '', content: string = '', loading: boolean = false) {
  const _title = ref(title)
  const _content = ref(content)
  const _loading = ref(loading)

  return [message(_title, _content, _loading), {
    title: _title,
    content: _content,
    loading: _loading
  }]
}