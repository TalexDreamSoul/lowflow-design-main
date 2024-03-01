<script setup lang="ts" name="HeaderToggleButton">
import { useVModel } from '@vueuse/core';
import { DArrowRight } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue?: boolean,
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const expand = useVModel(props, 'modelValue', emits)
</script>

<template>
  <div @click="expand = !expand" :class="{ expand }">
    {{ expand ? "收起" : "展开" }}基础设置
    <el-icon>
      <DArrowRight />
    </el-icon>
  </div>
</template>

<style lang="scss" scoped>
div {
  z-index: 5;
  position: absolute;
  display: flex;

  cursor: pointer;
  align-items: center;

  color: #4078e0;
  font-size: 14px;
  margin-left: 16px;
  bottom: 30px;
  left: 530px;

  .el-icon {
    margin-top: 2px;
    margin-left: 3px;

    transform: rotate(90deg);
    transition: cubic-bezier(0.215, 0.610, 0.355, 1) .5s;
  }

  transition: cubic-bezier(0.215, 0.610, 0.355, 1) .35s;
}

.expand {

  .el-icon {
    transform: rotate(-90deg);
  }

  bottom: 1rem;
  left: 50%;

  transform: translateX(-50%);
}
</style>