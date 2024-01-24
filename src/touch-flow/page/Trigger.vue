<script setup lang="ts" name="AttrTrigger">
import { computed } from 'vue'
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  modelValue: any;
  attrs: any;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: any): void;
}>();

const model = useVModel(props, "modelValue", emits);
</script>

<template>
  <el-select
    class="trigger-container"
    v-model="model"
    filterable
    placeholder="选择字段"
  >
    <el-option
      v-for="item in attrs"
      :key="item.field"
      :label="item.fieldName"
      :value="item.field"
    />
  </el-select>
</template>

<style scoped lang="scss"></style>
