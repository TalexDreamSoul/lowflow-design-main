<script setup lang="ts">
import dagre from 'dagre'
import PStartVue from "./p/PStart.vue";
import PPolicySettings from "./p/PPolicySettings.vue";
import Branch from "./p/Branch.vue";
import SubBranch from './p/SubBranch.vue'
import { ref, watch, nextTick, onMounted, onBeforeUnmount, watchEffect } from "vue";
import { VueFlow, useVueFlow, Position } from '@vue-flow/core'
// import { ControlButton, Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { createNodes } from './flow-drawer'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/core/dist/style.css'

const props = defineProps<{
  p: any;
}>();
// 配置画布节点
const comps: any = {
  start: PStartVue,
  strategy: PPolicySettings,
  Delivery: Branch,
  SubBranch,
};

const nodes = ref<Array<any>>([])
const edges = ref<Array<any>>([])

function refreshFlow() {

  const [_nodes, _edges] = createNodes(props.p)

  console.log(_nodes, _edges)

  nodes.value = _nodes
  edges.value = _edges

}
refreshFlow()

const flow = useVueFlow()

flow.onPaneReady(() => flow.fitView())

const dagreGraph = ref(new dagre.graphlib.Graph())

dagreGraph.value.setDefaultEdgeLabel(() => ({}))

function handleLayout() {
  console.log('layout')

  // we create a new graph instance, in case some nodes/edges were removed, otherwise dagre would act as if they were still there
  dagreGraph.value = new dagre.graphlib.Graph()

  dagreGraph.value.setDefaultEdgeLabel(() => ({}))

  dagreGraph.value.setGraph({
    rankdir: 'TB',
    align: 'DL',
    nodesep: 100,  //相同层级中节点的间距  默认 50
    edgesep: 100,  //一个节点同事有多条连接线之间的间距  默认10
    ranksep: 50,   //相邻层级之间的间距  默认50
    marginx: 50,   //图整体与画布的左右间距。默认 0
    marginy: 100  //图整体与画布的上下间距。默认 0
  })

  for (const node of nodes.value) {
    // if you need width+height of nodes for your layout, you can use the dimensions property of the internal node (`GraphNode` type)
    const graphNode = flow.findNode(node.id)!

    dagreGraph.value.setNode(node.id, { width: graphNode.dimensions.width || 150, height: graphNode.dimensions.height || 50 })
  }

  for (const edge of edges.value) {
    dagreGraph.value.setEdge(edge.source, edge.target)
  }

  dagre.layout(dagreGraph.value)

  console.log(dagreGraph.value)

  // set nodes with updated positions
  nodes.value = nodes.value.map((node) => {
    const nodeWithPosition = dagreGraph.value.node(node.id)

    return {
      ...node,
      position: { x: nodeWithPosition.x, y: nodeWithPosition.y },
    }
  })

  nextTick(() => {
    flow.fitView()
  })
}

console.log(flow)

// @ts-ignore
window.refreshFlow = refreshFlow
</script>

<template>
  <!-- <component :p="p" :is="comps[p.nodeType]" /> -->
  <VueFlow :nodes="nodes" :edges="edges" @nodes-initialized="handleLayout">

    <template #node-start="slot">
      <PStartVue :p="flow.findNode(slot.id)!.data" />
    </template>

    <template #node-strategy="slot">
      <PPolicySettings :p="flow.findNode(slot.id)!.data" />
    </template>

    <MiniMap />

  </VueFlow>
</template>

<style lang="scss">
.vue-flow {
  // width: 100%;

  // height: calc(100% - 80px);

  // overflow: hidden;
}

.vue-flow__node {
  visibility: visible !important;
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
  top: 100%;

  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%);
  background: linear-gradient(rgb(32, 92, 203) 0%, rgb(89, 143, 241) 100%);

  transition: 0.25s;
}

div.PBlock {
  p {
    &.title {
      button {
        padding-right: 0;
      }

      display: flex;

      align-items: center;
      justify-content: space-between;

      width: 100%;
    }

    margin: 0;
    font-size: 1.25rem;
  }

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

  // position: absolute;
  display: inline-flex;

  border-radius: 8px;

  // transform: translate(-50%, -50%);
  overflow: unset;
}
</style>
