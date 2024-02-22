<script setup lang="ts" name="FlowPage">
import { watchEffect, onMounted, reactive, ref } from "vue";
import FlowHeader from "../touch-flow/page/FlowHeader.vue";
// import TouchFlow from "./TouchFlow.vue";
import { randomStr } from "~/utils/common";
import { touchSubmitReview, type Request, type MarketingTouchNodeEditDTO } from './touch-total'
import XFlow from './x/XFlow.vue'
import { ArrowRight } from "@element-plus/icons-vue";
import { useRouter } from 'vue-router'
import { ElMessage } from "element-plus";
// import { createTemplatePopover } from '../utils/touch-templates'

// createTemplatePopover('新建外呼模版', 'digital')
const props = defineProps<{
  modelValue?: Request;
  readonly?: boolean;
}>();

const flowOptions = reactive({
  basic: {
    _expand: false,
    touchName: "",
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
    nodeType: "Start",
    height: 250,
    children: [],
  },
});

watchEffect(() => {
  if (props.modelValue) {
    const data = props.modelValue

    console.log("!!!", data)

    Object.assign(flowOptions.basic, {
      touchName: data.touchName,
      disturb: disturbReduction(data),
      target: targetReduction(data),
    })

    flowOptions.p.children = data.nodes as any

    //   touchName: flowOptions.basic.touchName,
    //   ...transformDisturb(flowOptions.basic.disturb),
    // ...transformTarget(flowOptions.basic.target)


    console.log('FlowPage updated!', props.modelValue)
  }
})

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

function targetReduction(data: Request) {
  return {
    enable: data.containTarget ?? props.readonly,
    list: data.targetRuleContent?.data || [],
  }
}

function transformNodes(__nodes: Array<any>) {
  const res: Array<any> = [];

  [...__nodes].forEach((node: any) => {
    console.log("do have father", node.father)

    if (node.father) {
      // 先拿到父元素中children 我这个元素的位置
      const fatherInd = [...node.father.children].indexOf((item: any) => item.nodeId === node.nodeId)

      node.preNodeId = (fatherInd < 1 ? node.father.nodeId : node.father.children[fatherInd - 1].nodeId)

      // delete node.father
    }

    if (node.children) {
      transformNodes(node.children)
      // [...node.children].forEach((child, index) => {
      //   node.children[index] = transformNodes([child])
      // })
    }

    res.push(node)
  })


  return res
}

function flatMaps(__nodes: Array<any>) {
  // 铺平，然后删除每一项的children 记得浅拷贝
  // 每一个node有一个children: [] 要铺平
  const res: Array<any> = [];

  const stack: any = [...__nodes]

  while (stack.length) {
    const node = stack.pop()

    const obj = { ...node }

    if (obj.children) {
      stack.push(...node.children)

      delete obj.children
    }

    res.push(obj)

  }

  return res
}

async function submitReview(status: string = 'approvalPending') {
  if (props.readonly) return

  console.groupCollapsed('submit')

  console.log("transformNodes", flowOptions.p.children)

  const _flowOptions: any = {
    ...flowOptions.p,
    nodes: flatMaps(transformNodes([ ...flowOptions.p.children ])),
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

  if (!+res.code) {
    return ElMessage({
      message: res.msg,
      type: "success",
      duration: 1000,
      onClose: () => {
        router.go(-1);
      },
    })
  }

  console.log(res, data)

  console.groupEnd()
}

const router = useRouter();

const dialogVisible = ref()

console.log("total flow", flowOptions);
</script>

<template>
  <div class="FlowPage">
    <el-container :class="{ shrink: modelValue, readonly, expand: flowOptions.basic._expand }" class="FlowPage-Container">
      <el-header>
        <FlowHeader v-if="!modelValue || !readonly" @submit-review="() => submitReview()" :basic="flowOptions.basic" />
        <div v-else class="FlowPage-ReadHeader">
          流程基础设置
          <el-button text type="primary" @click="dialogVisible = true">
            查看设置<el-icon>
              <ArrowRight />
            </el-icon>
          </el-button>
        </div>
      </el-header>
      <el-main>
        <el-scrollbar>
          <XFlow :p="flowOptions.p as any" />
          <!-- <TouchFlow :p="flowOptions.p" /> -->
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>

  <teleport to="body">
    <el-dialog v-model="dialogVisible">
      <FlowHeader :readonly="readonly" :expandAll="true" class="FlowPage-ShrinkHeader" @submit-review="submitReview"
        :basic="flowOptions.basic" />
    </el-dialog>
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

.FlowPage-Container.shrink {
  .el-header {
    height: 32px;
    line-height: 32px;

    font-size: 14px;
    font-weight: 600;
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
