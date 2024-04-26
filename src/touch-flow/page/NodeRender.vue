<script setup lang="ts" name="NodeRender">
import { useVModel } from '@vueuse/core';
import { ref } from 'vue';

const props = defineProps<{
  modelValue: string;
  conditions: any[];
  readonly?: boolean;
  obj: any
}>()

if (!props.conditions) {
  console.error("[LOW-FLOW] Make sure that this component will not be used as appPUSH touch result. Here are the stacks!")
} else console.log("Node Render Conditions", props.conditions)

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>()

const nodes = ref<any[]>([])
const model = useVModel(props, 'modelValue', emits)

function getNodes() {
  // 去找那一条的field是touchId
  const { conditions, obj } = props
  const res = conditions.find(item => item.attr?.field === 'touchCode')

  const { fieldReplaceValue } = res.attr
  if (Number.isInteger(fieldReplaceValue)) {
    // TODO 加载指定 fieldReplaceValue 为id的流程图数据
    // nodes.value 
  } else {
    console.log("get nodes", fieldReplaceValue)

    const each = [...(window.$flow?.p?.children || [])]

    // 把每一项的children都加入 然后继续遍历
    while (each.length) {
      const item = each.shift()
      if (item.children) {
        each.push(...item.children)

        if (item.nodeType !== 'diversion')
          nodes.value.push(item)
      }
    }
  }

  console.log("nodes", res, obj, nodes)
}

getNodes()
</script>

<template>
  <div>
    <el-select filterable style="width: 181px" v-model="model" :disabled="readonly">
      <el-option :value="item.nodeId" :label="item.nodeName" v-for="item in nodes">{{ item.nodeName }}</el-option>
    </el-select>
  </div>
</template>