<script setup lang="ts">
import NodeTree from "../index.vue";
import AddBut from "../Add/index.vue";
import { BranchNode } from "./index";
import { FlowNode } from "../Node/index";
import { inject, ref } from "vue";
import { StartNode } from "../Start";

export interface BranchProps {
  node: BranchNode;
}

withDefaults(defineProps<BranchProps>(), {});
const { addNode, openPenal } = inject<{
  addNode: (type: string, node: FlowNode) => void;
  openPenal: (node: FlowNode) => void;
}>("nodeHooks")!;

const onOpenPenal = () => {
  console.log(`output->node.value111`);
  let process = ref<FlowNode>({
    id: "root2",
    pid: null,
    type: "customers",
    name: "受众客户设置",
    formProperties: [],
  } as unknown as StartNode);
  console.log(`output->node.value`, process.value);
  openPenal(process.value);
};
</script>

<template>
  <div class="branchwarp">
    <div class="flex-btw">
      <div>
        分支名称A
      </div>
      <div>
        <span class="righttext">
          流量分配
        </span>
        <span  class="icontext">
          50%
        </span> 
      </div>
    </div>
    <div>
      <el-empty description="尚未配置" image-size="76px"/>
      
    </div>

  </div>
  <div class="branch-node">
    <!--添加新分支按钮-->
    <div class="add-branch">
      <slot></slot>
    </div>
    <!--分支节点-->
    <div v-for="(item,index) in node.children" :key="item.id" class="col-box">
      <template v-if="node.children.length===(index+1)">
        <!-- <div :class="`top-right-border`"></div> -->
        <!-- <div :class="`bottom-right-border`"/> -->
      </template>
      <template v-if="index===0">
        <!-- <div :class="`top-left-border`"></div> -->
        <!-- <div :class="`bottom-left-border`"/> -->
      </template>
      <node-tree :node="item" />
    </div>
  </div>
  <!--添加节点-->
  <add-but @add-node="(type:string)=>addNode(type,node)" @open-Penal="onOpenPenal()" class="branch-but" />
</template>

<style scoped lang="scss">

:root { --el-empty-padding: 20px 0; }
.branch-node {
  display: flex;
  //border-top: var(--el-border);
  // border-bottom: var(--el-border);
  overflow: visible;
  position: relative;
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 50%; /* 设置伪元素一半宽度 */
    height: 1px; /* 设置边框粗细 */
    background-color: var(--el-border-color); /* 设置边框颜色 */
    left: 25%;
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }

  .add-branch {
    position: absolute;
    left: 50%;
    top: -15px;
    z-index: 2;
    transform: translateX(-50%);
  }

  .col-box {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    //background-color: var(--el-bg-color);

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 1px;
      height: 100%;
      background-color: var(--el-border-color);
    }

    .top-left-border {
      position: absolute;
      left: 0;
      top: -2px;
      height: 3px;
      width: 50%;
      //  background-color: var(--el-bg-color);
    }

    .bottom-left-border {
      position: absolute;
      left: 0;
      bottom: -2px;
      height: 3px;
      width: 50%;
      // background-color: var(--el-bg-color);
    }

    .top-right-border {
      position: absolute;
      right: 0;
      top: -2px;
      height: 3px;
      width: 50%;
      // background-color: var(--el-bg-color);
    }

    .bottom-right-border {
      position: absolute;
      right: 0;
      bottom: -2px;
      height: 3px;
      width: 50%;
      //background-color: var(--el-bg-color);
    }
  }
}

.branch-but {
  &:before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 1px;
    height: 100%;
    background-color: var(--el-border-color);
  }
}

.branchwarp {
  width: 416px;
  padding: 24px;
  background: #ffffff;
  box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  .flex-btw {
    display: flex;
    justify-content: space-between;
    .righttext {
      height: 16px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.6);
    }
    .icontext {
      height: 16px;
      font-size: 16px;
      font-weight: 500;
      color: #00c068;
    }
  }
}
</style>
