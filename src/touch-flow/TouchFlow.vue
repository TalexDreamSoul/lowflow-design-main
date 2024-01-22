<script setup lang="ts">
import PStartVue from './p/PStart.vue';
import PPolicySettings from './p/PPolicySettings.vue';
import { useWindowSize, useElementBounding } from '@vueuse/core'
import { ref, watch, nextTick } from 'vue';

const props = defineProps<{
  p: any
}>()

const comps = {
  'start': PStartVue,
  'PolicySettings': PPolicySettings
}

const now = ref()

const { width, height } = useWindowSize()

function drawPath(source: HTMLElement, target: HTMLElement) {
  // check if exist
  const exist = target._conn

  if (exist) {
    exist.remove()
  }

  const sourceRect = useElementBounding(source)
  const targetRect = useElementBounding(target)

  const cx = sourceRect.x.value + sourceRect.width.value / 2

  if (Math.abs(targetRect.x.value - cx) < 10) {
    console.log('equals')

    return
  }

  // 获取 source 相对于 target 的偏移
  const addon = targetRect.x.value < cx ? (sourceRect.width.value / 2) : -500
  const x = targetRect.x.value - sourceRect.x.value + addon + 500;
  const y = targetRect.y.value - sourceRect.y.value - 180;

  console.log('source', source, sourceRect.x.value, targetRect.x.value, x, y)

  // gen svg
  // 创建一个SVG元素
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "1000");
  svg.setAttribute("height", "400");

  // 创建一个路径元素
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  // 设置路径数据（这里是一个简单的二次贝塞尔曲线）
  const pathData = generateCurve({
    x: 510,
    y: 205
  }, {
    x,
    y
  })
  path.setAttribute("d", pathData);

  // 设置路径的样式
  path.setAttribute("stroke", "black");
  path.setAttribute("fill", "transparent");

  // 将路径元素添加到SVG中
  svg.appendChild(path);

  // 将SVG元素添加到文档的 body 中
  target.appendChild(svg);

  target._conn = {
    svg,
    remove: () => {
      if (target._conn?.svg) {
        target._conn.svg.remove()
        delete target._conn
      }
    }
  }
}

function generateCurve(source: { x: number, y: number }, target: { x: number, y: number }) {
  const { x: sourceX, y: sourceY } = source;
  const { x: targetX, y: targetY } = target;

  // 计算中点
  var midX = (sourceX + targetX) / 2;
  var midY = (sourceY + targetY) / 2;

  // 创建SVG路径数据（从 source 到中点，再到 target，使用二次贝塞尔曲线）
  return "M " + sourceX + " " + sourceY +
    " Q " + sourceX + " " + midY +
    " " + midX + " " + midY +
    " Q " + targetX + " " + midY +
    " " + targetX + " " + targetY;
}

const jp = jsPlumb.getInstance({
  //锚点位置；对任何没有声明描点的Endpoint设置锚点，用于source及target节点
  Anchor: ["Bottom", "Top"],
  Anchors: ["Bottom", "Top"],  //连线的source和target Anchor
  ConnectionsDetachable: false, //连线是否可用鼠标分离
  ConnectionOverlays: [  //连线的叠加组件，如箭头、标签
    ["Arrow", {  //箭头参数设置
      location: 1,
      visible: true,
      width: 11,
      length: 11,
      id: "ARROW",
      events: {
        click: function () {
        }
      }
    }],
    ["Label", {  //标签参数设置
      location: 0.1,
      id: "label",
      cssClass: "aLabel", //hover时label的样式名
      events: {
        tap: function () {
        }
      },
      visible: true
    }]
  ],
  Connector: "Bezier", //连线的类型，流程图(Flowchart)、贝塞尔曲线等
  //父级元素id；假如页面元素所在上层不同，最外层父级一定要设置
  Container: "module",
  //如果请求不存在的Anchor、Endpoint或Connector，是否抛异常
  DoNotThrowErrors: false,
  //通过jsPlumb.draggable拖拽元素时的默认参数设置
  DragOptions: { cursor: 'pointer', zIndex: 2000 },
  DropOptions: {}, //target Endpoint放置时的默认参数设置
  Endpoint: "Dot", //端点（锚点）的样式声明
  //用jsPlumb.connect创建连接时，source端点和target端点的样式设置
  Endpoints: [null, null],
  EndpointOverlays: [], //端点的叠加物
  //端点的默认样式
  EndpointStyle: {
    fill: 'transparent', stroke: '#1565C0', radius: 4,
    strokeWidth: 1
  },
  EndpointStyles: [null, null], //连线的source和target端点的样式
  //端点hover时的样式
  EndpointHoverStyle: {
    fill: '#1565C0', stroke: '#1565C0', radius: 4,
    strokeWidth: 1
  },
  //连线的source和target端点hover时的样式
  EndpointHoverStyles: [null, null],
  //连线hover时的样式
  HoverPaintStyle: { stroke: '#1565C0', strokeWidth: 3 },
  LabelStyle: { color: "black" }, //标签的默认样式，用css写法。
  LogEnabled: false, //是否开启jsPlumb内部日志
  Overlays: [], //连线和端点的叠加物
  MaxConnections: 10, //端点支持的最大连接数
  //连线样式
  PaintStyle: { stroke: '#1565C0', strokeWidth: 1, joinstyle: 'round' },
  ReattachConnections: true, //是否重新连接使用鼠标分离的线?
  RenderMode: "svg", //默认渲染模式
  Scope: "jsPlumb_DefaultScope", //范围，具有相同scope的点才可连接
  // 删除线的时候节点不删除
  DeleteEndpointsOnDetach: false,
  reattach: true,
})

window.jp = jp

const refreshLines = () => {
  const nowDom = now.value;
  nowDom.classList.remove('single-line')

  const have = props.p?.child?.length
  const _multiple = props.p?.child instanceof Array && props.p?.child.length > 1;
  const nextLayer = nowDom.parentElement?.nextElementSibling

  if (!nextLayer) return

  if (!have) return

  if (!_multiple) {

    if (!nextLayer.className.includes('TouchFlow')) return

    return nowDom.classList.add('single-line')
  }

  jp.reset()

  // nowDom._pointU = ((100000 + (Math.random() * 1000000)).toString(16).slice(6))
  // nowDom._point = jp.addEndpoint(nowDom, {
  //   anchor: ['Bottom'],
  //   uuid: nowDom._pointU
  // })

  // jp.makeSource(nowDom, {
  //   endpoint: "Dot",
  //   anchor: "Continuous"
  // })

  // const rootU = nowDom._pointU

  const flows = nextLayer.querySelectorAll('.TouchFlow')

  window.root = nowDom

  flows.forEach((flow: HTMLElement) => {
    const nextPoint = flow.querySelector('.fake-point')!

    console.log("N", nextPoint)

    // if (!nextPoint._point) {
      // nextPoint._pointU = ((100000 + (Math.random() * 1000000)).toString(16).slice(6))
      // nextPoint._point = jp.addEndpoint(nextPoint, {
      //   anchor: ['Top'],
      //   uuid: nextPoint._pointU
      // })

      // jp.makeTarget(nextPoint, {
      //   endpoint: "Dot",
      //   anchor: "Continuous"
      // })
    // }

    // if (nextPoint._conn) {
      // jp.deleteConnection(nextPoint._conn)

      // console.log('delete conn', nextPoint._conn)

      // delete nextPoint._conn

      // delay = 2000
      // return
    // }

    nextPoint._conn = jp.connect({
      // uuids: [rootU, nextPoint._pointU]
      source: nowDom,
      target: nextPoint,
    })

    // drawPath(nowDom, nextPoint as HTMLElement)
  })

}

watch(props.p, () => {
  nextTick(refreshLines)
}, { deep: true })

watch(() => width.value + height.value, refreshLines)
</script>

<template>
  <div class="TouchFlow-Layer">
    <div ref="now" class="TouchFlow">
      <div class="fake-point" />
      <component :p="p" :is="comps[p.type]" />
    </div>
  </div>
  <template v-if="p.child">
    <div class="TouchFlow-Layer">
      <TouchFlow v-for="child in p.child" :p="child" />
    </div>
  </template>
</template>

<style lang="scss">
.TouchFlow {
  position: absolute;
}

.TouchFlow-Layer {
  position: relative;
  display: flex;

  margin: 10px 20px 260px;

  justify-content: center;

  width: 100%;
}

.start-add {
  z-index: 10;
}

.fake-point {
  svg {
    transform: translate(-50%, -50%);

    background-color: #00000010;
  }

  z-index: 100;
  position: absolute;

  width: 32px;
  height: 32px;

  top: -30%;
  left: 20%;

  transform: translate(-50%, -50%);

  position: none;
  border-radius: 50%;
}

.single-line:has(div.PBlock) {
  &::before {
    content: "";
    position: absolute;

    bottom: -145px;
    left: 50%;

    transform: translate(-50%, -50%);

    width: 2px;
    height: 85px;

    background-color: var(--el-color-primary);
  }

  &::after {
    content: "";
    position: absolute;

    bottom: -110px;
    left: 50%;

    transform: translate(-50%, -50%) scale(.5, 1) rotate(-45deg);

    border: 10px solid var(--el-color-primary);
    border-radius: 5px;
    border-top-color: transparent;
    border-right-color: transparent;
    // background-color: var(--el-color-primary);
  }
}


div.PBlock {
  p {
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
      font-size: 1rem;
    }

    span {
      opacity: .75;
    }

    padding: 10px;

    border-radius: 8px;
    border: 1px solid var(--el-border-color);
    background-color: var(--el-fill-color);
  }

  &-Content {
    &.theme {
      flex-direction: column;
    }

    .el-icon {
      top: .125rem;

      margin-bottom: .5rem;
    }

    display: flex;
    margin-top: .75rem;

    gap: 2rem;
  }

  position: relative;

  left: 50%;

  border-radius: 8px;

  transform: translateX(-50%);
  overflow: unset;
}
</style>