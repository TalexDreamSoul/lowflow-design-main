<script setup lang="ts" name="TitleMention">
import { ref, watch, nextTick } from 'vue'
import { sleep } from '~/utils/common'

const props = defineProps<{
  text: String,
}>()

console.log("tm", props)

const dom = ref()

async function refreshText(text: string) {
  const el = dom.value
  if (!el) return

  const style = el.style

  style.transform = 'translateX(10px)'
  style.opacity = '0'
  style.filter = 'blur(2px)'

  await sleep(200)

  el.innerText = text

  style.transform = 'translateX(-10px)'

  await sleep(200)

  style.transform = 'translateX(0)'
  style.opacity = '1'
  style.filter = 'blur(0px)'
}

watch(() => props.text, (val, old) => {

  nextTick(() => refreshText(String(val)))

}, { immediate: true })
</script>

<template>
  <span ref="dom" class="TitleMention">
  </span>
</template>

<style lang="scss" scoped>
.TitleMention {
  display: block;

  transition: 0.25s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}
</style>