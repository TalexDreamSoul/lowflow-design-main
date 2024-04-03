<template>
  <div id="coverCot" style="width: 100vw; height: 100vh; overflow: hidden">
    <section class="section-cot" style="width: 100%; height: 100%">
      <div id="container">
        <div id="draw-cot" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs, provide, watchEffect, computed } from "vue";
import Hierarchy from "@antv/hierarchy";
import initGraph from "./graph";
import { _delChild, genIdNodeReactive } from "./../flow-utils";
import { MarketingTouchEditDTO } from "../p/behavior/marketing";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { useWindowSize } from "@vueuse/core";

interface IGraphData {
  id: string;
  children: object[];
  type: number;
  data: object;
  [prop: string]: any;
}

const props = defineProps<{
  p: IGraphData;
  readonly?: boolean;
}>();

let _Graph: any;

let treeMap = props.p;

const route = useRoute()
const { width, height } = useWindowSize()
const _edit = computed(() => route.params?.id)
const getNodeReactive = genIdNodeReactive(props.p);

const del = (p: MarketingTouchEditDTO) => {
  const fatherNode = getNodeReactive(p.father.id);

  console.log("delete", fatherNode, p);

  if (!_delChild(fatherNode, p)) {
    ElMessage.error({
      message: "删除失败！",
    });

    console.log(fatherNode, p);

    throw new Error("删除失败!");
  }

  // window.$refreshLayout();
};

const layoutFn = () => {
  console.groupCollapsed("layoutFn");

  const result = Hierarchy.compactBox(treeMap, {
    direction: "TB",
    getWidth() {
      return 680;
    },
    getHeight(d: any) {
      const { nodeType } = d;
      console.log("__d", d, nodeType);
      if (nodeType === "subDiversion") {
        console.log("__subDiversion");
        return 450;
      }
      return d.height ? parseInt(d.height) : 600;
    },
    getHGap() {
      const k = 0.07692307692307693;
      const b = 157.3076923076923;

      const width = window.innerWidth;
      if (width === 1920) return -150;
      if (width === 2560) return 30;
      if (Math.abs(width - 1445) <= 100) return -50;
      if (Math.abs(width - 1600) <= 100) return -80;
      if (Math.abs(width - 1050) <= 100) return 60;

      console.log("width", width);
      return k * width - b;
    },
    getVGap() {
      return 30;
    },
    getSide: () => {
      return "bottom";
    },
  });
  const model: {
    nodes: any[];
    edges: any[];
  } = { nodes: [], edges: [] };

  const _: any = {
    Start: (height: number) => height - 95,
    strategy: (height: number, data: any) => {
      console.log("@@@---", data.data);
      if (data.data?.father?.nodeType === "subDiversion") return height - 40;
      if (data.data.nodeName === "兜底策略器") return height - 155;

      if (props.readonly) {
        if (String(data.data.nodeDelayed.delayedAction).toLocaleLowerCase().indexOf('touch') !== -1)
          return height - 60

        return height - 160
      }

      if (String(data.data.nodeDelayed.delayedAction).toLocaleLowerCase().indexOf('touch') !== -1)
        return height - 260

      return height - 360;
    },
    diversion: (height: number) => height - 132,
    subDiversion: (height: number, _data: any) => {
      const { data } = _data;
      let calcHeight = height - 125;

      if (data.diversionType || data.eventDelayed?.isDelayed) {
        calcHeight = calcHeight - 200;
        if (data?.nodeContent?.data?.$template.has) {
          calcHeight += 100;
        }
      }

      if (props.readonly) {
        calcHeight -= 100
      }

      console.log("><", data);

      return calcHeight;
    },
  };

  const traverse = (data: any) => {
    if (data) {
      console.log("data", data);
      data.id = data.data.id = data.data.nodeId;

      const shape = `${data.data.nodeType}`;
      const calc = _[shape];

      console.log("calc-height", data.height, calc(data.height, data));

      model.nodes?.push({
        id: `${data.id}`,
        x: data.x + 800,
        y: data.y + 200,
        shape,
        data: {
          ...data,
          $del: del,
          $edit: _edit,
          $d: getNodeReactive,
          $readonly: props.readonly,
        },
        width: 610,
        height: calc(data.height, data),
        ports: {
          groups: {
            bottom: {
              position: "bottom",
              attrs: {
                circle: {
                  stroke: "transparent",
                  strokeWidth: 1,
                  fill: "transparent",
                },
              },
            },

            top: {
              position: "top",
              attrs: {
                circle: {
                  stroke: "transparent;",
                  strokeWidth: 1,
                  fill: "transparent",
                },
              },
            },
          },
          items: [
            {
              id: `bottom-${data.id}`,
              group: "bottom", // 指定分组名称
            },
            {
              id: `top-${data.id}`,
              group: "top", // 指定分组名称
            },
          ],
        },
      });
    }

    if (data.children) {
      data.children.forEach((item: any) => {
        traverse(item);

        model.edges?.push({
          source: { cell: data.id, port: "bottom-" + data.id },
          target: { cell: item.id, port: "top-" + item.id },
          shape: "dag-edge",
          labels: [
            {
              attrs: {
                line: {
                  stroke: "#73d13d",
                },
                text: {
                  text: item.data.lineLabel || "",
                },
              },
            },
          ],
        });
      });
    }
  };
  traverse(result);

  console.log(model);

  console.groupEnd();

  _Graph.fromJSON(model);

  setTimeout(() => _Graph.positionContent("top"), 200)
};

onMounted(() => {
  _Graph = initGraph();

  // layoutFn();
  watchEffect(() => {
    $ignored: [width.value + height.value]
    const { p } = toRefs(props);

    layoutFn();
    layoutFn();
  });
});

window.$refreshLayout = layoutFn;
</script>

<style lang="scss">
.FlowPage {
  body {
    box-sizing: border-box;
    margin: 0;
  }

  .my-selecting {
    border: 1px solid red;
    display: block;
    z-index: 0;
  }

  @keyframes running-line {
    to {
      stroke-dashoffset: -1000;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .x6-node-selected .node {
    border-color: #1890ff;
    border-radius: 2px;
    box-shadow: 0 0 0 4px #d4e8fe;
  }

  .x6-node-selected .node.success {
    border-color: #52c41a;
    border-radius: 2px;
    box-shadow: 0 0 0 4px #ccecc0;
  }

  .x6-node-selected .node.failed {
    border-color: #ff4d4f;
    border-radius: 2px;
    box-shadow: 0 0 0 4px #fedcdc;
  }

  .x6-edge:hover path:nth-child(2) {
    stroke: #1890ff;
    stroke-width: 1px;
  }

  .x6-edge-selected path:nth-child(2) {
    stroke: #1890ff;
    stroke-width: 1.5px !important;
  }

  .section-cot {
    display: flex;
  }

  .section-cot #container {
    position: relative;
    flex: 1;
  }

  .section-cot #container #draw-cot {
    width: 100%;
    height: 100%;
  }

  ::-webkit-scrollbar {
    width: 0;
  }
}

.start-add {
  &.display {
    opacity: 1;

    pointer-events: unset;
  }

  &::before {
    content: "";
    position: absolute;
    margin: -1rem;

    width: 150%;
    height: 150%;

    left: -25%;
    top: -25%;

    border-radius: 50%;
  }

  &.disabled {
    opacity: 0.85;
    filter: invert(0.1) brightness(95%);

    pointer-events: none;
  }

  &:hover {
    opacity: 0.95;
  }

  z-index: 10;
  position: absolute;

  left: 50%;

  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(1.2);
  background: linear-gradient(rgb(32, 92, 203) 0%, rgb(89, 143, 241) 100%);

  transition: 0.25s;
}

body:has(.PBlock) .el-drawer {
  div.ListWrapper {
    position: relative !important;
  }

  div.MicroEnterpriseDrag {
    margin-bottom: 10rem !important;
  }

  .FloatFixed {
    bottom: 0;
  }
}

div.PBlock {

  p {
    &.title {
      .el-button {
        position: absolute;

        right: 20px;
      }

      display: flex;

      gap: 2rem;

      align-items: center;
      justify-content: space-between;

      width: 100%;
    }

    margin: 0;
    font-size: 1.25rem;
  }

  display: flex;

  &-Section {
    &:hover {
      cursor: pointer;
      border-color: var(--el-color-primary);
    }

    p {
      margin: 5px 0;
      font-size: 1rem;
    }

    span {
      color: #999;
    }

    padding: 16px;
    width: 280px;
    background: linear-gradient(180deg, #f2f4f8 0%, rgba(242, 244, 248, 0.4) 100%) rgba(255, 255, 255, 0.4);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
  }

  &-Content {
    &.theme {
      flex-direction: column;

      & .PBlock-Section {
        &::before {
          z-index: -1;
          content: "";
          position: absolute;

          left: 0;
          top: 0;

          width: 100%;
          height: 100%;

          opacity: 0.12;
          border-radius: 0 4px 4px 0;
          background-color: var(--theme-color, red);
        }

        position: relative;

        width: 100%;
        border: none;
        border-left: 4px solid var(--theme-color, red);

        border-radius: 4px;
        background: unset;
      }
    }

    .el-icon {
      top: 0.125rem;

      margin-bottom: 0.5rem;
    }

    display: flex;
    margin-top: 0.75rem;

    gap: 0.5rem;

    font-size: 14px;
    cursor: pointer;
  }

  position: relative;

  left: 50%;

  border-radius: 8px;

  transform: translateX(-50%);
  overflow: unset;
}
</style>
