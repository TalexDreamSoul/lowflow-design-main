<script setup lang="ts">
import { computed, watch, watchEffect } from "vue";
import { useVModel } from "@vueuse/core";

const $props = defineProps<{
  modelValue: string;
  item: any;
  obj?: any;
  attrs: any;
  selected?: string;
  readonly?: boolean;
}>();

const operatorOptions = [
  {
    value: "为真",
    type: ["boolean"],
  },
  {
    value: "为假",
    type: ["boolean"],
  },
  {
    value: "大于",
    type: ["num"],
  },
  {
    value: "小于",
    type: ["num"],
  },
  {
    value: "等于",
    type: ["num", "text", "nodeId", "touchResult", "touchCode"],
  },
  {
    value: "不等于",
    type: ["num", "text"],
  },
  {
    value: "包含",
    type: ["text"],
  },
  {
    value: "不包含",
    type: ["text"],
  },
  {
    value: "为空",
    type: ["text", "num", "boolean", "date"],
  },
  {
    value: "不为空",
    type: ["text", "num", "boolean", "date"],
  },
  {
    value: "绝对时间",
    type: ["date"],
  },
  {
    value: "相对时间",
    type: ["date"],
  },
  {
    value: "区间",
    type: ["num"],
  },
];

console.log("operators", $props);

const $emits = defineEmits<{
  (e: "update:modelValue", modelValue: any): void;
}>();
const data = useVModel($props, "modelValue", $emits);
const selectItem = computed(() =>
  $props.selected || $props.attrs.filter(
    (attr: any) =>
      attr.field === ($props.item?.attr?.field || $props.item.field) //|| attr.labelName === $props.item?.labelName
  )?.[0]
);
const type = computed(() =>
  $props.selected ? ((_: any) => _.labelValueType || _.labelType || _.fieldType)($props.selected) : selectItem.value?.fieldType ?? "none"
);
const operators = computed(() => {
  let _type = type.value

  if (selectItem.value?.field === "nodeId") {
    _type = "nodeId"
  } else if (selectItem.value?.field === "touchResult") {
    _type = "touchResult"
  } else if (selectItem.value?.field === "touchCode") {
    _type = "touchCode"
  }

  return operatorOptions.filter((item) => item.type.includes(_type))
});

watch(() => $props.item.field, () => {
  $props.item.fieldOp = ''
  console.log('1', selectItem.value, operatorOptions, type.value, $props.attrs, $props.item, $props.attrs.filter(
    (attr: any) =>
      attr.field === ($props.item?.attr?.field || $props.item.field)))
})

// watchEffect(() => {
//   $_ignored: $props

//   data.value = ''
// })

// watch($props.item, (old, newVal) => {
//   if ( JSON.stringify(old) === JSON.stringify(newVal) ) return
//   $_ignored: $props

//   data.value = ''
// }, { deep: true })F
</script>

<template>
  <el-select :disabled="readonly" v-if="obj?.type !== 'label'" class="operator-container" v-model="data"
    placeholder="筛选符">
    <el-option v-for="item in operators" :key="item.value" :label="item.value" :value="item.value" />
  </el-select>
</template>

<style scoped lang="scss">
.operator-container {
  width: 100px;
  flex-shrink: 0;

  min-width: 100px;
}
</style>
