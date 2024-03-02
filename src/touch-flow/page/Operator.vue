<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue'
import { useVModel } from '@vueuse/core'

const $props = defineProps<{
  modelValue: string
  item: any;
  attrs: any;
  selected?: string;
}>()

const operatorOptions = [
  {
    value: "为真",
    type: ["boolean"]
  },
  {
    value: "为假",
    type: ["boolean"]
  },
  {
    value: "大于",
    type: ["num"]
  },
  {
    value: "小于",
    type: ["num"]
  },
  {
    value: "等于",
    type: ["num", "text"]
  },
  {
    value: "不等于",
    type: ["num", "text"]
  },
  {
    value: "包含",
    type: ["text"]
  },
  {
    value: "不包含",
    type: ["text"]
  },
  {
    value: "为空",
    type: ["text", "num", "boolean", "date"]
  },
  {
    value: "不为空",
    type: ["text", "num", "boolean", "date"]
  },
  {
    value: "绝对时间",
    type: ["date"]
  },
  {
    value: "相对时间",
    type: ["date"]
  },
  {
    value: "区间",
    type: ["num"]
  }
]

const $emits = defineEmits<{
  (e: 'update:modelValue', modelValue: any): void
}>()
const data = useVModel($props, 'modelValue', $emits)
const type = computed(() => $props.selected ? ((_: any) => _.labelValueType || _.labelType || _.fieldType)($props.selected) : ($props.attrs.filter((attr: any) => (attr.field === $props.item.field) || (attr.labelName === $props.item?.labelName))?.[0]?.fieldType ?? "none"));
const operators = computed(() => operatorOptions.filter((item) => item.type.includes(type.value)))

// watchEffect(() => {
//   $_ignored: $props

//   data.value = ''
// })

// watch($props.item, (old, newVal) => {
//   if ( JSON.stringify(old) === JSON.stringify(newVal) ) return
//   $_ignored: $props

//   data.value = ''
// }, { deep: true })
</script>

<template>
  <el-select class="operator-container" v-model="data" placeholder="筛选符">
    <el-option v-for="item in operators" :key="item.value" :label="item.value" :value="item.value" />
  </el-select>
</template>

<style scoped lang="scss">
.operator-container {
  // width: 100%;
  flex-shrink: 0;
}
</style>
