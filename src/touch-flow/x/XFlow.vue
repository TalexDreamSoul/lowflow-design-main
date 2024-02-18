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
import { onMounted, ref, toRefs, provide, watchEffect } from 'vue';
import Hierarchy from '@antv/hierarchy';
import initGraph from './graph';
import { genIdNodeReactive } from './../flow-utils'

interface IGraphData {
  id: string;
  children: object[];
  type: number;
  data: object;
  [prop: string]: any;
}

const props = defineProps<{
  p: IGraphData;
}>();

let _Graph: any;

let treeMap = props.p;

const getNodeReactive = genIdNodeReactive(props.p)

const layoutFn = () => {
  const result = Hierarchy.compactBox(treeMap, {
    direction: 'TB',
    getWidth() {
      return 610;
    },
    getHeight(d: any) {
      return d.height ? parseInt(d.height) : 40;
    },
    getHGap() {
      return 30;
    },
    getVGap() {
      return 150;
    },
    getSide: () => {
      return 'bottom';
    },
  });
  const model: {
    nodes: any[];
    edges: any[];
  } = { nodes: [], edges: [] };

  const _: any = {
    'Start': (height: number) => height - 125,
    'strategy': (height: number, data: any) => {
      console.log("@@@", data)
      if (data.data.nodeName === '兜底策略器') return height - 135

      return height - 35
    }
  }

  const traverse = (data: any) => {
    if (data) {
      console.log("data", data)
      data.id = data.data.id = data.data.nodeId

      const shape = `${data.data.nodeType}`;
      const calc = _[shape]

      console.log("calc", calc, shape)
      model.nodes?.push({
        id: `${data.id}`,
        x: data.x + 700,
        y: data.y + 200,
        shape,
        data: { ...data, $d: getNodeReactive },
        width: 610,
        height: calc(data.height, data) || 100,
        ports: {
          groups: {
            bottom: {
              position: 'bottom',
              attrs: {
                circle: {
                  stroke: 'transparent',
                  strokeWidth: 0,
                  fill: 'transparent',
                },
              },
            },

            top: {
              position: 'top',
              attrs: {
                circle: {
                  stroke: 'transparent',
                  strokeWidth: 0,
                  fill: 'transparent',
                },
              },
            },
          },
          items: [
            {
              id: `bottom-${data.id}`,
              group: 'bottom', // 指定分组名称
            },
            {
              id: `top-${data.id}`,
              group: 'top', // 指定分组名称
            },
          ],
        },
      });
    }

    if (data.children) {
      data.children.forEach((item: any) => {
        model.edges?.push({
          source: { cell: data.id, port: 'bottom-' + data.id },
          target: { cell: item.id, port: 'top-' + item.id },
          shape: 'dag-edge',
          labels: [
            {
              attrs: {
                line: {
                  stroke: '#73d13d',
                },
                text: {
                  text: item.data.lineLabel || '',
                },
              },
            },
          ],
        });
        traverse(item);
      });
    }
  };
  traverse(result);

  console.log(model)

  _Graph.fromJSON(model);
};

onMounted(() => {
  _Graph = initGraph();

  // layoutFn();
  watchEffect(() => {
    const { p } = toRefs(props);

    layoutFn()
    layoutFn()

    // setTimeout(() => { layoutFn() }, 5)
  })
});

window.l = layoutFn
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

  &:hover {
    opacity: 0.95;
  }

  z-index: 10;
  position: absolute;

  left: 50%;

  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%);
  background: linear-gradient(rgb(32, 92, 203) 0%, rgb(89, 143, 241) 100%);

  transition: 0.25s;
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
    background: linear-gradient(180deg,
      #f2f4f8 0%,
      rgba(242, 244, 248, 0.4) 100%) rgba(255, 255, 255, 0.4);
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

        width: 280px;
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
  }

  position: relative;

  left: 50%;

  border-radius: 8px;

  transform: translateX(-50%);
  overflow: unset;
}
</style>