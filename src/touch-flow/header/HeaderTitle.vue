<script setup lang="ts" name="HeaderTitle">
import { IFlowHeader } from '../flow-types'
import { useVModel } from '@vueuse/core'
import { commonValidate } from "../flow-utils";
import type { FormInstance, FormRules } from 'element-plus'
import { ref, reactive } from 'vue'

interface IHeaderTitle {
  /**
   * 策略流程名称
   */
  modelValue: string
  readonly?: boolean
  /**
   * 控制是否展开
   */
  expand: boolean
}

const props = defineProps<IHeaderTitle>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const headerRef = ref<FormInstance>()
const model = useVModel(props, 'modelValue', emits)

const rules = reactive<FormRules<IFlowHeader>>({
  touchName: [{ validator: commonValidate, message: "请输入触达名称", trigger: 'blur' }],
})
</script>

<template>
  <div class="HeaderTitle" :class="{ expand }">
    <div class="HeaderTitle-Shrink">
      <el-form status-icon :rules="rules" :model="{ touchName: model }">
        <el-form-item prop="touchName">
          <template #label>
            <p class="HeaderTitle-Label">策略流程名称：</p>
          </template>
          <el-input :show-word-limit="true" style="margin-top: 10px" prop="touchName" maxlength="18" :disabled="readonly" placeholder="策略流程名称"
            v-model="model" :style="{ width: '400px', height: '40px' }" />
        </el-form-item>
      </el-form>
    </div>
    <div class="HeaderTitle-Expanded">
      <h3 class="HeaderTitle-Label">流程基础设置</h3>
    </div>
  </div>
</template>

<style lang="scss" scoped>
div.expand {
  .HeaderTitle-Expanded {
    opacity: 1;
    transform: translateX(0%);
  }

  .HeaderTitle-Shrink {
    opacity: 0;
    pointer-events: none;
    transform: translateX(5%);
  }

}

.HeaderTitle,
.HeaderTitle-Expanded,
.HeaderTitle-Shrink {
  .HeaderTitle-Expanded {
    opacity: 0;
    pointer-events: none;
    transform: translateX(-5%);

    transition: cubic-bezier(0.215, 0.610, 0.355, 1) .5s;
  }

  &-Shrink {
    z-index: 1;

    pointer-events: all;
    transition: cubic-bezier(0.215, 0.610, 0.355, 1) .5s;
  }

  position: absolute;
  display: flex;

  gap: .5rem;
  align-items: center;

  min-width: 600px;
}
</style>