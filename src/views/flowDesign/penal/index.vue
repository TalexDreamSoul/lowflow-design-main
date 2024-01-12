<script setup lang="ts">
import { ClickOutside as vClickOutside } from "element-plus";
import { FlowNode } from "../nodes/Node/index";
import { type Component, ref } from "vue";
import ApprovalAttr from "./ApprovalAttr.vue";
import CcAttr from "./CcAttr.vue";
import StartAttr from "./StartAttr.vue";
import ConditionAttr from "./ConditionAttr.vue";
import ConditionSetAttr from "./ConditionSetAttr.vue";
import CustomersAttr from "./CustomersAttr.vue";

const nodeProps: Record<string, Component> = {
  start: StartAttr,
  approval: ApprovalAttr,
  cc: CcAttr,
  condition: ConditionAttr,
  conditionSet: ConditionSetAttr,
  customers: CustomersAttr,
};

let flowNode = ref<FlowNode>({
  id: "",
  pid: "",
  type: "",
  name: "",
  child: null,
});
const visible = ref(false);
const showInput = ref(false);
const onClickOutside = () => {
  visible.value = false;
};
const open = (node: FlowNode) => {
  flowNode.value = node;
  visible.value = true;
};
const childComponent = ref<any>(null); // 确保 ref 初始化为 null
// 提交抽屉的逻辑
const submitDrawer = () => {
  try {
    childComponent.value?.submitEvent();
  } catch (error) {
    console.error("Error occurred in submitDrawer:", error);
  }
};
// 向子组件暴露一个函数以供子组件调用
defineExpose({
  open,
});
</script>

<template>
  <el-drawer v-model="visible" size="55%" :show-close="false">
    <template #header="{ titleId, titleClass }">
      <span :id="titleId" :class="titleClass">

        {{ flowNode!.name }}
      </span>
    </template>
    <template #default>
      <component ref="childComponent" :node="flowNode" :is="nodeProps[flowNode!.type]" />
    </template>
    <template  v-if="flowNode.type&&flowNode.type==='conditionSet'" #footer>
      <div style="flex: auto">
        <el-button @click="onClickOutside">取消</el-button>
        <el-button type="primary" @click="submitDrawer,visible = false;">保存</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
:deep(.el-tabs__content) {
  margin-top: 10px;
}
</style>
