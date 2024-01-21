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
import { fa } from "element-plus/es/locale";

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
const used = ref<boolean>(false);

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
  <div class="startnodeWrap">
    <div class="hearder">
      {{ node.name }}
    </div>
    <el-text class="flex-space">
      <div class="g6_start_content" data-reactroot="" @click="onOpenPenal(1)">
        <div class="innerstart">
          <div :class="used?'title titlecheck':'title'">
            <el-icon :color="used?'#4078e0':'#90A0B8'">
              <Position />
            </el-icon>
            <span>
              进入条件
            </span>
            <div class="divunderline" v-if="used">
            </div>
            <el-icon v-if="used" class="iconright" color="#00C068" size="24">
              <CircleCheckFilled />
            </el-icon>
          </div>
          <div class="content">
            <div v-if="!used">
              设置流程类型、流程有效期、流程开始时间、进入限制
            </div>
            <div v-else>
              流程类型：
              <el-text> 定时型-单次</el-text>

              <br>
              进入时间：
              <el-text> 2024-01-04 09:00 进入</el-text>

            </div>
          </div>
        </div>
      </div>
      <div class="g6_start_content" data-reactroot="" @click="onOpenPenal(2)">
        <div class="innerstart">
          <div :class="used?'title titlecheck':'title'">
            <el-icon :color="used?'#4078e0':'#90A0B8'">
              <User />
            </el-icon>
            <span>受众客户</span>
            <div class="divunderline" v-if="used">
            </div>
            <el-icon v-if="used" class="iconright" color="#00C068" size="24">
              <CircleCheckFilled />
            </el-icon>

          </div>
          <div class="content">

            <div v-if="!used">
              根据客户属性、客户标签、客户行为、行为序列筛选能够进入流程的客户
            </div>
            <div v-else>
              客户属性满足：
              <el-text>1条</el-text>

              <br>
              客户行为满足：
              <el-text> 3条</el-text>

            </div>
          </div>
        </div>

      </div>
    </el-text>
  </div>
</template>

<style scoped lang="scss">
.startnodeWrap {
  padding: 24px;
  .hearder {
    //width: 120px;
    height: 24px;
    font-size: 18px;
    font-weight: 500;
    color: #000000;
    line-height: 24px;
  }
}
.g6_start_content {
  flex: 1;

  padding: 16px;
  width: 320px;
  background: linear-gradient(180deg, #f2f4f8 0%, rgba(242, 244, 248, 0.4) 100%)
    rgba(255, 255, 255, 0.4);
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  &:hover {
    border: 1px solid #4078e0;
  }
}
.g6_start_content:nth-of-type(1) {
  margin-right: 12px;
  overflow-y: scroll;
}
.flex-space {
  display: flex;
  margin-top: 12px;
}
.title {
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #333;
  overflow: hidden;
  position: relative;
  padding-bottom: 12px;
  .iconright {
    position: absolute;
    right: 0;
  }
  .divunderline {
    width: 160px;
    height: 7px;
    background: linear-gradient(
      82deg,
      rgba(64, 120, 224, 0.4) 0%,
      rgba(64, 120, 224, 0) 100%
    );
    border-radius: 2px 2px 2px 2px;
    opacity: 0.6;
    position: absolute;
    bottom: 10px;
  }
}
.titlecheck {
  color: #4078e0;
}
.content {
  font-size: 14px;
  line-height: 17px;
  color: #929293;
}
</style>