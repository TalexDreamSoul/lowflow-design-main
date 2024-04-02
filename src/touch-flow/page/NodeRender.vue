<script setup lang="ts" name="NodeRender">
import { useVModel } from '@vueuse/core';

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

const model = useVModel(props, 'modelValue', emits)

function getNodes() {
  console.log("nodes", props)
}

getNodes()
</script>

<template>
  <div>
    <el-select v-model="model">
      <!-- {{ window.$flow.basic.touchCode }} -->
    </el-select>
  </div>
</template>