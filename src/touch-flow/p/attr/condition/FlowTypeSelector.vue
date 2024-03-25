<script setup lang="ts" name="FlowTypeSelector">
import { AlarmClock, Pointer } from "@element-plus/icons-vue";
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  modelValue: string;
  readonly?: boolean;
}>();
const emits = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const model = useVModel(props, "modelValue", emits);
</script>

<template>
  <div :class="{ disabled: readonly }" class="FlowTypeSelector">
    <div :class="{ active: model === 'immediately' }" @click="model = 'immediately'">
      <el-icon> <AlarmClock /> </el-icon>定时型-单次
    </div>
    <div :class="{ active: model === 'repeat' }" @click="model = 'repeat'">
      <el-icon> <AlarmClock /> </el-icon>定时型-重复
    </div>
    <div :class="{ active: model === 'trigger' }" @click="model = 'trigger'">
      <el-icon> <Pointer /> </el-icon>触发型
    </div>
  </div>
</template>

<style lang="scss">
.FlowTypeSelector {
  &.disabled {
    opacity: .65;
    cursor: not-allowed !important;
    div {
      user-select: none;
      pointer-events: none;
    }
  }
  display: flex;

  gap: 1rem;
}

.FlowTypeSelector div {
  .el-icon {
    margin-right: 4px;
  }
  display: flex;
  padding: 0.25rem 1rem;
  align-items: center;

  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
  border: 1px solid #e5e5e5;

  &:hover {
    background-color: #f0f0f0;
  }

  &.active {
    color: #fff;
    background-color: #4078e0;
  }
}
</style>
