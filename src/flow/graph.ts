import { Graph, Path } from "@antv/x6";
import { register, getTeleport } from "@antv/x6-vue-shape";

import PStartVue from "~/touch-flow/p/PStart.vue";

import StartNode from "./components/node/startnode.vue";
import common from "./components/node/common.vue";

const registerNode = () => {
  register({
    shape: "dag-node1",
    // inherit: "vue-shape",
    width: 180,
    height: 36,
    component: StartNode,
    // ports: {
    //   groups: {
    //     top: {
    //       position: "top",
    //       attrs: {
    //         circle: {
    //           r: 4,
    //           magnet: true,
    //           stroke: "#C2C8D5",
    //           strokeWidth: 1,
    //           fill: "#fff",
    //         },
    //       },
    //     },
    //     bottom: {
    //       position: "bottom",
    //       attrs: {
    //         circle: {
    //           r: 4,
    //           magnet: true,
    //           stroke: "#C2C8D5",
    //           strokeWidth: 1,
    //           fill: "#fff",
    //         },
    //       },
    //     },
    //   },
    // },
  });

  register({
    shape: "dag-node2",
    // inherit: "vue-shape",
    width: 180,
    height: 36,
    component: common,
    //   ports: {
    //     groups: {
    //       top: {
    //         position: "top",
    //         attrs: {
    //           circle: {
    //             r: 4,
    //             magnet: true,
    //             stroke: "#C2C8D5",
    //             strokeWidth: 1,
    //             fill: "#fff",
    //           },
    //         },
    //       },
    //       bottom: {
    //         position: "bottom",
    //         attrs: {
    //           circle: {
    //             r: 4,
    //             magnet: true,
    //             stroke: "#C2C8D5",
    //             strokeWidth: 1,
    //             fill: "#fff",
    //           },
    //         },
    //       },
    //     },
    //   },
  });

  Graph.registerEdge(
    "dag-edge",
    {
      inherit: "edge",
      defaultLabel: {
        markup: [
          {
            tagName: "rect",
            selector: "body",
          },
          {
            tagName: "text",
            selector: "label",
          },
        ],
        attrs: {
          label: {
            fill: "#000",
            fontSize: 14,
            textAnchor: "middle",
            textVerticalAnchor: "middle",
            pointerEvents: "none",
          },
          body: {
            ref: "label",
            fill: "#ffd591",
            stroke: "#ffa940",
            strokeWidth: 2,
            rx: 4,
            ry: 4,
            refWidth: "140%",
            refHeight: "140%",
            refX: "-20%",
            refY: "-20%",
          },
        },
        position: {
          distance: 100,
          options: {
            absoluteDistance: true,
            reverseDistance: true,
          },
        },
      },
      attrs: {
        line: {
          stroke: "#C2C8D5",
          strokeWidth: 2,
          targetMarker: {
            name: "block",
            width: 12,
            height: 8,
          },
        },
      },
    },
    true
  );

  Graph.registerConnector(
    "algo-connector",
    (s: any, e: any) => {
      const offset = 4;
      const deltaY = Math.abs(e.y - s.y);
      const control = Math.floor((deltaY / 3) * 2);

      const v1 = { x: s.x, y: s.y + offset + control };
      const v2 = { x: e.x, y: e.y - offset - control };

      return Path.normalize(
        `M ${s.x} ${s.y}
           L ${s.x} ${s.y + offset}
           C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
           L ${e.x} ${e.y}
          `
      );
    },
    true
  );
};

export default function initGraph() {
  registerNode();
  const container = document.getElementById("container");
  return new Graph({
    grid: {
      size: 10,
      visible: true,
      type: "dot", // 'dot' | 'fixedDot' | 'mesh'
      args: {
        color: "#a05410", // 网格线/点颜色
        thickness: 1, // 网格线宽度/网格点大小
      },
    },
    background: {
      color: "#fffbe6", // 设置画布背景颜色
    },
    container: container!,
    panning: {
      enabled: true,
      eventTypes: ["leftMouseDown", "mouseWheel"],
    },
    resizing: {
      restricted: false
    },
    mousewheel: {
      enabled: true,
      modifiers: "ctrl",
      factor: 1.1,
      maxScale: 1.5,
      minScale: 0.5,
    },
    highlighting: {
      magnetAdsorbed: {
        name: "stroke",
        args: {
          attrs: {
            fill: "#fff",
            stroke: "#31d0c6",
            strokeWidth: 4,
          },
        },
      },
    },
    connecting: {
      snap: true,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      connector: "algo-connector",
      connectionPoint: "anchor",
      anchor: "center",
      validateMagnet({ magnet }: any) {
        // return magnet.getAttribute('port-group') !== 'top'

        // 限制连线配置
        return true;
      },
      createEdge() {},
    },
    selecting: {
      enabled: true,
      multiple: true,
      rubberEdge: true,
      rubberNode: true,
      modifiers: "shift",
      rubberband: true,
    },
    keyboard: true,
    clipboard: true,
    history: true,
  });
}
