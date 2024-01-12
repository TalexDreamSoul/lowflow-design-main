<script setup lang="ts">
import AddBut from "../Add/index.vue";
import { useVModels } from "@vueuse/core";
import {
  ClickOutside as vClickOutside,
  componentSizeMap,
  ElInput,
  useFormSize,
} from "element-plus";
import { FlowNode, ErrorInfo } from "./index";
import { type Component, computed, inject, nextTick, ref } from "vue";
import {
  List,
  Stamp,
  Promotion,
  EditPen,
  CircleClose,
  Share,
  WarnTriangleFilled,
} from "@element-plus/icons-vue";
import { FilterRules, StartNode } from "../Start";

export interface NodeProps {
  icon?: string;
  node: FlowNode;
  color?: string;
  readOnly?: boolean;
  close?: boolean;
  arrow?: boolean;
  errorInfo?: ErrorInfo;
}

const icons: Record<string, Component> = {
  list: List,
  stamp: Stamp,
  share: Share,
  promotion: Promotion,
};

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
const showInput = ref(false);
//是否是兜底策略器
const insuranceStrategist = ref(false);

const inputRef = ref<InstanceType<typeof ElInput>>();
const formSize = useFormSize();
const getComponentWidth = computed<string>(() => {
  return componentSizeMap[formSize.value || "default"] + 546 + "px";
});
const getComponentHeight = computed<string>(() => {
  return componentSizeMap[formSize.value || "default"] + 62 + "px";
});
const { addNode, delNode, openPenal } = inject<{
  addNode: (type: string, currentNode: FlowNode) => void;
  delNode: (node: FlowNode) => void;
  openPenal: (node: FlowNode) => void;
}>("nodeHooks")!;
const onOpenPenal = () => {
  console.log(`output->node.value111`);
  if ($props.readOnly) return;
  if (node.value.type == "start") return;
  console.log(`output->node.value`, node.value);
  openPenal(node.value);
};
const onShowInput = () => {
  if ($props.readOnly) return;
  showInput.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
};
const onClickOutside = () => {
  if (showInput.value) {
    showInput.value = false;
  }
};

const addonOpenPenal = (type: String) => {
  console.log(`output->node.value111`);
  openPenal(node.value);
  let process;
  switch (type) {
    case "strategistSet":
      //流量策略器设置
      process = ref<FlowNode>({
        id: "root1",
        pid: null,
        type: "strategistSet",
        name: "流量策略器设置",
        formProperties: [],
        def: false,
        conditions: {
          logicalOperator: "and",
          conditions: [],
          groups: [],
        } as FilterRules,
      } as unknown as StartNode);
      openPenal(process.value);
      break;
    case "diverter":
      //流量策略器设置--分流
      process = ref<FlowNode>({
        id: "root1",
        pid: null,
        type: "diverter",
        name: "分流器",
        formProperties: [],
        def: false,
        conditions: {
          logicalOperator: "and",
          conditions: [],
          groups: [],
        } as FilterRules,
      } as unknown as StartNode);
      openPenal(process.value);
      break;
    case "policySettings":
      //选择策略器设置，可以无限点出来后面的Select policySettings
      process = ref<FlowNode>({
        id: "root1",
        pid: null,
        type: "policySettings",
        name: "选择策略器设置",
        formProperties: [],
        def: false,
        conditions: {
          logicalOperator: "and",
          conditions: [],
          groups: [],
        } as FilterRules,
      } as unknown as StartNode);
      openPenal(process.value);
      break;

    default:
      break;
  }
  // let process = ref<FlowNode>({
  //   id: "root2",
  //   pid: null,
  //   type: "customers",
  //   name: "受众客户设置",
  //   formProperties: [],
  // } as unknown as StartNode);
  // console.log(`output->node.value`, process.value);
  // openPenal(process.value);
};
</script>

<template>
  <div class="node-box">
    <el-card shadow="always" @click="onOpenPenal()" :class="['node',{'error-node':$props.errorInfo.showError}]">
      <el-tooltip placement="top-start">
        <template #content>
          {{ $props.errorInfo.message }}
        </template>
        <el-icon class="warn-icon" :size="20" v-show="$props.errorInfo.showError">
          <WarnTriangleFilled @click.stop />
        </el-icon>
      </el-tooltip>
      <template #header>
        <div class="head">
          <el-text style="color: #fff;" tag="b" truncated @click.stop="onShowInput">
            {{ node.name }}
          </el-text>
        </div>
      </template>
      <div @click.stop>
        <el-popconfirm title="您确定要删除该节点吗？" width="200" :hide-after="0" placement="right-start" @confirm="delNode(node)">
          <template #reference>
            <el-button class='node-close' v-show="close && !readOnly" plain circle :icon="CircleClose" size="small" type="danger" />
          </template>
        </el-popconfirm>
      </div>
      <slot></slot>
    </el-card>
    <add-but @add-node="(type:string)=>addNode(type,node)" @open-Penal="(type:string)=>addonOpenPenal(type)" :insuranceStrategist="insuranceStrategist" />
  </div>
</template>

<style scoped lang="scss">
.node-box {
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 1px;
    //height: 50%;
    background-color: var(--el-border-color);
  }

  .warn-icon {
    cursor: pointer;
    position: absolute;
    right: -30px;
    top: 50%;
    transform: translateY(-50%);

    color: var(--el-color-error);
  }

  .error-node {
    box-shadow: 0 0 5px 0 var(--el-color-error-light-3);
  }

  .node {
    border-radius: 7px;
    cursor: pointer;
    position: relative;
    overflow: visible;
    min-height: v-bind(getComponentHeight);
    width: v-bind(getComponentWidth);

    .node-close {
      position: absolute;
      top: -10px;
      right: -10px;
      display: none;
    }

    &:hover {
      &:not(.error-node) {
        box-shadow: 0 0 5px 0 var(--el-color-primary);
      }

      .node-close {
        display: block;
      }
    }

    :deep(.el-card__body) {
      padding: 0px !important;
    }
    :deep(.el-card__header) {
      padding: calc(var(--el-card-padding) - 18px)
        calc(var(--el-card-padding) - 13px);
      background: v-bind(color);
      border-radius: 7px 7px 0 0;

      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        .el-input__wrapper {
          background-color: var(--el-card-bg-color);
        }

        .node-icon {
          color: transparent;
        }
      }
    }
  }

  .arrow {
    /* &:before{
       content: '';
       position: absolute;
       top: -13px;
       left: 50%;
       transform: translateX(-50%);
       width: 0;
       border-style: solid;
       border-width: 8px 6px 0;
       border-color: var(--el-border-color) transparent transparent;
       background-color: var(--el-bg-color);
     }*/
  }
}
</style>
