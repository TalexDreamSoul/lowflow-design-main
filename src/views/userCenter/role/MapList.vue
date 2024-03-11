<script setup lang="ts" name="MapList">
import { ref, watchEffect, computed } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  data: any,
  modelValue: any
}>()

const emits = defineEmits(['update:modelValue'])

const subData = ref()
const model = useVModel(props, 'modelValue')

watchEffect(() => {
  $ignored: [props, subData]

  subData.value = null
  handleSelect(null)

  console.log('updated', props.data)
})

function handleSelect(item: any) {
  const arr = model.value = (model.value || {
    now: null,
    sub: null
  })
  if (!item) {
    arr.now = null
  } else {
    arr.now = item
    subData.value = item.subMenus
  }

}

function calcActive(item: any) {
  const { now } = (model.value || {})
  if (!now) return

  return +now.id === +item?.id
}
</script>

<template>
  <ul class="RoleFlatMap-List">
    <li :class="{ active: calcActive(item) }" @click="handleSelect(item)" class="RoleFlatMap-ListItem"
      v-for="item in data" :key="item.id">
      {{ item.menuName }}
    </li>
  </ul>
  <MapList v-if="subData" v-model="model.sub" :data="subData" />
</template>