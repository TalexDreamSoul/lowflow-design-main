<script setup lang="ts" name="FlowPage">
import { watchEffect, reactive, ref, onMounted } from "vue";
import FlowHeader from "./header/FlowHeader.vue";
import { randomStr } from "~/utils/common";
import { touchSubmitReview, type Request } from "./touch-total";
import XFlow from "./x/XFlow.vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { flatConvert2Tree } from "./flow-utils";
import { IFlowHeader } from "./flow-types";
import { getmarketingTouchDetail, updateMarketingTouch } from "~/api/index";
import { reactiveMessage } from "~/utils/mention/mention";
import { sleep } from "~/utils/common";
import { el } from "element-plus/es/locale";

const route = useRoute();

const props = defineProps<{
  modelValue?: Request;
  readonly?: boolean;
}>();

const flowOptions = reactive<
  {
    basic: IFlowHeader;
  } & { p: any }
>({
  basic: {
    _expand: false,
    touchName: "",
    disturb: {
      enable: false,
      time: [],
      action: "quit",
    },
    target: {
      enable: false,
      targetRuleContent: {
        data: [],
      },
    },
  },
  p: {
    nodeId: randomStr(12),
    nodeType: "Start",
    height: 250,
    children: [] as any[],
  },
});

async function covertData(data: any) {
  console.log("!!!", data);

  Object.assign(flowOptions.basic, {
    touchName: data.touchName,
    disturb: disturbReduction(data),
    target: targetReduction(data),
  });

  flowOptions.p.children = flatConvert2Tree([...data.nodes!]);

  const _temp = { ...data };

  delete _temp.children;
  delete _temp.touchName;

  Object.assign(flowOptions.p, _temp);

  console.log("FlowPage updated!", props.modelValue, _temp);
}

watchEffect(() => {
  // $ignored: [props.modelValue, route.params.id]

  if (props.modelValue) {
    covertData(props.modelValue);
  }

  if (route.params?.id?.length) {
    const [, { loading, show }] = reactiveMessage(
      "请稍后",
      "正在转换数据",
      true,
      0,
      false
    );

    const timer = setTimeout(() => (show.value = true), 500);

    getmarketingTouchDetail({
      id: route.params.id,
    })
      .then((res: any) => res.data && covertData(res.data))
      .finally(() => {
        clearTimeout(timer);
        loading.value = false;
      });
  }
});

function transformDisturb(disturb: typeof flowOptions.basic.disturb) {
  return {
    isDisturb: disturb.enable,
    disturbStartTime: disturb.time[0],
    disturbEndTime: disturb.time[1],
    disturbType: disturb.action,
  };
}

function disturbReduction(data: Request) {
  return {
    enable: data.isDisturb,
    time: [data.disturbStartTime, data.disturbEndTime],
    action: data.disturbType,
  };
}

function transformTarget(target: typeof flowOptions.basic.target) {
  return {
    containTarget: target.enable,
    targetRuleContent: target.targetRuleContent,
  };
}

function targetReduction(data: Request) {
  return {
    enable: data.containTarget || false,
    targetRuleContent: data.targetRuleContent || [],
  };
}

function transformNodes(__nodes: Array<any>) {
  const res: Array<any> = [];

  [...__nodes].forEach((node: any) => {
    console.log("do have father", node.father);

    node.$id && (node.id = node.$id);

    if (node.father) {
      if (node.father.nodeType === "Start") {
        node.preNodeId = "root";
      } else {
        // 先拿到父元素中children 我这个元素的位置
        const fatherInd = [...node.father.children].indexOf(
          (item: any) => item.nodeId === node.nodeId
        );

        node.preNodeId =
          fatherInd < 1
            ? node.father.nodeId
            : node.father.children[fatherInd - 1].nodeId;
      }

      // node.nextNodeId = (fatherInd < node.father.children.length - 1 ? node.father.children[fatherInd + 1].nodeId : node.children?.[0]?.nodeId)

      if (!node.father?.nextNodeId?.data) {
        node.father.nextNodeId = {
          data: [],
        };
      }

      // 获取子元素
      // const nextNodes = node.father.nextNodeId.data //(node.father.nextNodeId = (node.father.nextNodeId || []))

      // nextNodes.push(node.nodeId)

      // delete node.father
    }

    if (node.children) {
      const children = node.children;
      if (children.length) {
        node.nextNodeId = {
          data: [...children].map((item) => item.nodeId),
        };
      }

      transformNodes(node.children);
      // [...node.children].forEach((child, index) => {
      //   node.children[index] = transformNodes([child])
      // })
    }

    res.push(node);
  });

  return res.reverse();
}

function flatMaps(__nodes: Array<any>) {
  // 铺平，然后删除每一项的children 记得浅拷贝
  // 每一个node有一个children: [] 要铺平
  const res: Array<any> = [];

  const stack: any = [...__nodes];

  while (stack.length) {
    const node = stack.pop();

    const obj = { ...node };

    if (obj.children) {
      stack.push(...node.children);

      delete obj.children;
    }

    res.push(obj);
  }

  return res;
}

async function submitReview(status: string = "approvalPending") {
  if (props.readonly) return;

  const [promise, r] = reactiveMessage("请稍后", "正在传输数据中...", true);
  const { title, content, loading } = r;

  console.groupCollapsed("submit");

  console.log("transformNodes", flowOptions.p.children);

  const _flowOptions: any = {
    ...flowOptions.p,
    nodes: flatMaps(transformNodes([...flowOptions.p.children])),
    touchName: flowOptions.basic.touchName,
    ...transformDisturb(flowOptions.basic.disturb),
    ...transformTarget(flowOptions.basic.target),
  };

  console.log("flowOptions", _flowOptions);

  delete _flowOptions.children;
  delete _flowOptions.id;

  const data: Request = {
    status,
  };
  if (route.params?.id?.length) {
    Object.assign(data, { ..._flowOptions, id: route.params?.id });
  } else {
    Object.assign(data, _flowOptions);
  }
  let res: any = route.params?.id?.length
    ? await updateMarketingTouch(data)
    : await touchSubmitReview(data);

  await sleep(1200);

  console.log("done", res);

  loading.value = false;

  title.value = "提交完毕";
  content.value = res.message || "失败";

  if (res?.code === '0') {
    router.push("/touchCenter/touchList");
  }

  console.log(data);

  console.groupEnd();
}

const router = useRouter();

const dialogVisible = ref();

// console.log("total flow", flowOptions);

// @ts-ignore
delete window.$flow;

Object.defineProperty(window, "$flow", {
  value: flowOptions,
  configurable: true,
});

const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <div class="FlowPage">
    <el-container :class="{ shrink: modelValue, readonly, expand: flowOptions.basic._expand }"
      class="FlowPage-Container">
      <el-header>
        <FlowHeader v-if="!modelValue || !readonly" :basic="flowOptions.basic">
          <template #controller>
            <div>
              <el-button @click="goBack" round>返回</el-button>
              <el-button @click="submitReview('draft')" round>保存草稿</el-button>
              <el-button round type="primary" @click="submitReview('approvalPending')"
                class="primaryStyle">提交审核</el-button>
            </div>
          </template>
        </FlowHeader>
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
        <!-- <el-scrollbar> -->
        <XFlow :readonly="readonly" :p="flowOptions.p as any" />
        <!-- </el-scrollbar> -->
      </el-main>
    </el-container>
  </div>

  <teleport to="body">
    <el-dialog title="流程基础设置" v-model="dialogVisible">
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
    height: 60%;
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
    position: absolute;

    width: 100%;

    height: 80px;
    max-height: 500px;
    overflow: hidden;
    perspective: 100px;
    transition: height 0.25s;
    background-color: #ffffff;
    box-shadow: 0 4px 4px 8px rgba(0, 0, 0, 0.02),
      0 2px 4px rgba(0, 0, 0, 0.125);

    animation: header-join 0.5s;
  }

  & .expand .el-header {
    border-radius: 0 0 18px 18px;
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

    transform: translateY(80px);
  }

  position: absolute;
  display: flex;

  width: 100%;
  height: 100%;

  overflow: hidden;

  .el-card__body {
    width: 100%;
  }
}

@keyframes header-join {
  from {
    transform: translateY(-50%) rotate3d(1, 0, 0, -90deg);
  }

  to {
    transform: translateY(0) rotate3d(1, 0, 0, 0deg);
  }
}

@import "./flow-style.scss";
</style>
