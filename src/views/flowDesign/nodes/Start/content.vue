<script setup lang="ts">
import { StartNode } from "./index";
import { useVModels } from "@vueuse/core";
import { ErrorInfo } from "./index";
import { FlowNode } from "../Node/index";
import {
  type Component,
  computed,
  inject,
  nextTick,
  ref,
  watchEffect,
  defineExpose,
} from "vue";

export interface StartContentProps {
  node: StartNode;
}
export interface NodeProps {
  icon?: string;
  node: FlowNode;
  color?: string;
  readOnly?: boolean;
  close?: boolean;
  arrow?: boolean;
  errorInfo?: ErrorInfo;
}
/**
 * 筛选规则
 */
export interface FilterRules {
  logicalOperator: "or" | "and";
  conditions: Condition[];
  groups: FilterRules[];
}

/**
 * 字段筛选结果
 */
export interface Condition {
  // 筛选字段
  field: string | null;
  // 条件运算符
  operator: string;
  // 筛选值
  value: any | null;
}
const $props = withDefaults(defineProps<NodeProps>(), {
  readOnly: false,
  close: true,
  arrow: true,
  errorInfo: () => ({
    showError: false,
    message: "",
  }),
});
const $emits = defineEmits<{
  (e: "update:node", title: string): void;
}>();
const { node } = useVModels($props, $emits);

// const $props = withDefaults(defineProps<StartContentProps>(), {});
const content = ref<string>("");
watchEffect(() => {
  content.value = $props.node.name;
});
const { addNode, delNode, openPenal } = inject<{
  addNode: (type: string, currentNode: FlowNode) => void;
  delNode: (node: FlowNode) => void;
  openPenal: (node: FlowNode) => void;
}>("nodeHooks")!;
const onOpenPenal = (v: number) => {
  if ($props.readOnly) return;
  let process = ref<FlowNode>({
    id: "root1",
    pid: null,
    type: "conditionSet",
    name: "流程类型设置",
    formProperties: [],
    def: false,
    conditions: {
      logicalOperator: "and",
      conditions: [],
      groups: [],
    } as FilterRules,
  } as unknown as StartNode);
  if (v == 2) {
    process = ref<FlowNode>({
      id: "root2",
      pid: null,
      type: "customers",
      name: "受众客户设置",
      formProperties: [],
      def: false,
      conditions: {
        logicalOperator: "and",
        conditions: [],
        groups: [],
      } as FilterRules,
    } as unknown as StartNode);
  }
  console.log(`output->node.value`, node.value, process.value, v);

  openPenal(process.value);
};
</script>

<template>
  <el-text class="flex-space">
    <div class="g6_start_content" data-reactroot="" @click="onOpenPenal(1)">
      <div class="innerstart">
        <div class="title"><el-icon>
            <Filter />
          </el-icon><span>进入条件</span></div>
        <div class="content">
          <span>
            设置流程类型、流程有效期、流程开始时间、进入限制
          </span>
          <span>
            类型：定时型-单次<br>
            进入时间：2024-01-04 09:00 进入
          </span>
        </div>
      </div>
    </div>
    <div class="g6_start_content" data-reactroot="" @click="onOpenPenal(2)">
      <div class="innerstart">
        <div class="title">
          <el-icon>
            <Avatar />
          </el-icon>
          <span>受众客户</span>
        </div>
        <div class="content">
          <span>
            根据客户属性、客户标签、客户行为、行为序列筛选能够进入流程的客户
          </span>
          <span>
            类型：定时型-单次<br>
            进入时间：2024-01-04 09:00 进入
          </span>
        </div>
      </div>

    </div>
  </el-text>
</template>

<style scoped lang="scss">
.g6_start_content {
  flex: 1;

  .innerstart {
    padding: 9px 11px;
    background: #e2f0ff;
    border-radius: 4px;
    /* margin-left: 10px; */
    min-height: 100px;
  }
}
.g6_start_content:nth-of-type(1) {
  margin-right: 12px;
  overflow-y: scroll;
  height: 100%;
}
.flex-space {
  display: flex;
  padding: 12px;
}
.title {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #475669;
  overflow: hidden;
}
.content {
  padding-top: 6px;
  font-size: 12px;
  line-height: 17px;
  color: #475669;
}
</style>