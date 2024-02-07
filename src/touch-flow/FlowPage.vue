<script setup lang="ts" name="FlowPage">
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import FlowHeader from "../touch-flow/page/FlowHeader.vue";
import TouchFlow from "./TouchFlow.vue";
import { randomStr } from "~/utils/common";
import { touchSubmitReview, type Request, type MarketingTouchNodeEditDTO } from './touch-total'

const props = defineProps<{
  modelValue?: boolean;
  readonly: boolean;
}>();

const flowOptions = reactive({
  basic: {
    _expand: false,
    touchName: "test",
    disturb: {
      enable: false,
      time: [],
      action: 0,
    },
    target: {
      enable: false,
      list: [],
    },
  },
  p: {
    nodeId: randomStr(12),
    nodeType: "start",
    children: [],
  },
});

function transformDisturb(disturb: typeof flowOptions.basic.disturb) {
  return {
    isDisturb: disturb.enable,
    disturbStartTime: disturb.time[0],
    disturbEndTime: disturb.time[1],
    disturbType: disturb.action,
  }
}

function disturbReduction(data: Request) {
  return {
    enable: data.isDisturb,
    time: [data.disturbStartTime, data.disturbEndTime],
    action: data.disturbType,
  }
}

function transformTarget(target: typeof flowOptions.basic.target) {
  return {
    containTarget: target.enable,
    targetRuleContent: {
      data: target.list
    },
  }
}

function transformNodes(__nodes: Array<any>) {
  const res: Array<any> = [];

  console.log(__nodes);

  [...__nodes].forEach((node: any) => {

    if (node.father) {
      // 先拿到父元素中children 我这个元素的位置
      const fatherInd = [...node.father.children].indexOf((item: any) => item.nodeId === node.nodeId)

      node.preNodeId = (fatherInd < 1 ? node.father.nodeId : node.father.children[fatherInd - 1].nodeId)

      // delete node.father
    }

    if (node.children) {
      [...node.children].forEach((child, index) => {
        node.children[index] = transformNodes([child])
      })
    }

    res.push(node)
  })


  return res
}

async function submitReview(status: string = 'approvalPending') {
  if (props.readonly) return
  
  console.log("transformNodes", flowOptions.p.children)

  const _flowOptions: any = {
    ...flowOptions.p,
    nodes: transformNodes(flowOptions.p.children),
    touchName: flowOptions.basic.touchName,
    ...transformDisturb(flowOptions.basic.disturb),
    ...transformTarget(flowOptions.basic.target)
  }

  console.log("flowOptions", _flowOptions)

  delete _flowOptions.children
  delete _flowOptions.id

  const data: Request = {
    status
  }
  Object.assign(data, _flowOptions)

  const res = await touchSubmitReview(data)

  console.log(res, data)
}

const dialogVisible = ref()

console.log("total flow", flowOptions);
</script>

<template>
  <div class="FlowPage">
    <el-container :class="{ readonly, expand: flowOptions.basic._expand }" class="FlowPage-Container">
      <el-header>
        <FlowHeader v-if="!readonly" @submit-review="submitReview" :basic="flowOptions.basic" />
        <div v-else class="FlowPage-ReadHeader">
          流程基础设置
          &nbsp;&nbsp;
          <el-text>
            <el-button type="primary" @click="dialogVisible = true">查看设置</el-button>
          </el-text>
        </div>
      </el-header>
      <el-main>
        <el-scrollbar>
          <TouchFlow :p="flowOptions.p" />
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>

  <teleport to="body">
    <el-drawer v-model="dialogVisible">
      <FlowHeader @submit-review="submitReview" :basic="flowOptions.basic" />
    </el-drawer>
  </teleport>
</template>

<style lang="scss">
div.el-dialog {
  border-radius: 8px;
}

.FlowPage-Container.expand {
  .el-header {
    height: auto;
  }
}

.el-scrollbar {
  width: 100%;
}

.FlowPage {
  .el-header {
    z-index: 100;
    position: sticky;

    height: 80px;
    max-height: 500px;
    overflow: hidden;
    transition: height 0.25s;
    background-color: var(--el-fill-color-lighter);
    box-shadow: 0 4px 4px 8px rgba(0, 0, 0, 0.02),
      0 2px 4px rgba(0, 0, 0, 0.125);
  }

  .el-main {
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, #eeeff6, #3880e41c);
      z-index: -1;
    }

    position: relative;
    display: flex;

    flex: 1;
    flex-direction: column;
    align-items: center;

    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
    background-size: 30px 30px;
  }

  position: absolute;
  display: flex;

  width: 100%;
  height: 100%;

  overflow: hidden;
}
</style>
