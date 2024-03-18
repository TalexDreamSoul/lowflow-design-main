<script setup lang="ts" name="MapList">
import { ref, watchEffect, nextTick } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  data: any;
  checked: any[];
  modelValue: any
}>()

const emits = defineEmits(['update:modelValue'])

const subData = ref()
const model = useVModel(props, 'modelValue')

watchEffect(() => {
  $ignored: [props, subData]

  subData.value = null

  nextTick(() => {
    if (!model.value?.now && props.data?.length) {
      console.log("we", props.data[0])
      handleSelect(props.data[0])
    } else handleSelect(null)
  })

  // console.log('updated', props.data)
})

function handleSelect(item: any) {
  const arr = model.value = (model.value || {
    now: null,
    sub: null
  })

  console.log("@Select", item, arr)

  arr.sub = {
    now: null,
    sub: null
  }

  if (!item) {
    arr.now = null
  } else {
    arr.now = item
    subData.value = item.subMenus
  }

}

function handleCheck(item: any) {
  const { $check, subMenus } = item

  if (!subMenus?.length) return

  let arr = [...subMenus]
  while (arr.length) {
    const pop = arr.pop()

    if (pop.subMenus?.length) {
      arr.push(...pop.subMenus)
    }

    pop.$check = $check
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
      <el-checkbox v-model="item.$check" :indeterminate="false" @change="handleCheck(item)" />
      {{ item.menuName }}
      {{ item.$im }}
    </li>
  </ul>
  <MapList v-if="subData" v-model="model.sub" :checked="checked" :data="subData" />
</template>