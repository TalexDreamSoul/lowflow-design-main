import { useWindowSize, useElementBounding } from '@vueuse/core'

declare module globalThis {
  interface Window {
    __line: ILine
    jsPlumb: any
  }
}

export interface ILine {
  sx: number,
  sy: number,
  ex: number,
  ey: number,
  color: string,
  width: number,
  dash: number[],
  dashOffset: number,
  cap: string,
  join: string,
  miterLimit: number,
  lineDashOffset: number,
  lineDash: number[],
  lineCap: string,
  lineJoin: string,
  lineMiterLimit: number
}

export function drawPath(source: HTMLElement, target: any, genner: any) {
  const [__, ___, , _, , jp] = genner()
  const exist = target._conn

  if (exist) {
    exist.remove()
  }

  if (!_ || !__ || !___?._) {
    return jp.connect({
      source,
      target
    })
  } else {
    jp.connect({
      uuids: [_?.rootU, _?.nextPoint._pointU]
    })
  }

  const sourceRect = useElementBounding(source)
  const targetRect = useElementBounding(target)

  const cx = sourceRect.x.value + sourceRect.width.value / 2

  if (Math.abs(targetRect.x.value - cx) < 10) {
    console.log('equals')

    return
  }

  const addon = targetRect.x.value < cx ? (sourceRect.width.value / 2) : -500
  const x = targetRect.x.value - sourceRect.x.value + addon + 500;
  const y = targetRect.y.value - sourceRect.y.value - 180;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "1000");
  svg.setAttribute("height", "400");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  const pathData = generateCurve({
    x: 510,
    y: 205
  }, {
    x,
    y
  })
  path.setAttribute("d", pathData);

  path.setAttribute("stroke", "black");
  path.setAttribute("fill", "transparent");

  svg.appendChild(path);

  target.appendChild(svg);

  // @ts-ignore force
  target._conn = {
    svg,
    remove: () => {
      // @ts-ignore force
      if (target._conn?.svg) {
        // @ts-ignore force
        target._conn.svg.remove()

        // @ts-ignore force
        delete target._conn
      }
    }
  }
}

export function generateCurve(source: { x: number, y: number }, target: { x: number, y: number }) {
  const { x: sourceX, y: sourceY } = source;
  const { x: targetX, y: targetY } = target;

  var midX = (sourceX + targetX) / 2;
  var midY = (sourceY + targetY) / 2;

  return "M " + sourceX + " " + sourceY +
    " Q " + sourceX + " " + midY +
    " " + midX + " " + midY +
    " Q " + targetX + " " + midY +
    " " + targetX + " " + targetY;
}

export function genJP() {
  const jp = window.jsPlumb.getInstance({
    Anchor: ["Bottom", "Top"],
    Anchors: ["Bottom", "Top"],
    ConnectionsDetachable: false,
    ConnectionOverlays: [
      ["Arrow", {
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
      ["Label", {
        location: 0.1,
        id: "label",
        cssClass: "aLabel",
        events: {
          tap: function () {
          }
        },
        visible: true
      }]
    ],
    Connector: "Bezier",
    Container: ".TouchFlow",
    DoNotThrowErrors: false,
    DragOptions: { cursor: 'pointer', zIndex: 2000 },
    Endpoints: [null, null],
    EndpointOverlays: [],
    EndpointStyle: {
      fill: 'transparent', stroke: '#1565C000', radius: 4,
      strokeWidth: 1
    },
    EndpointStyles: [null, null],
    EndpointHoverStyle: {
      fill: '#579DF600', stroke: '#579DF600', radius: 4,
      strokeWidth: 1
    },
    EndpointHoverStyles: [null, null],
    HoverPaintStyle: { stroke: '#579DF6', strokeWidth: 3 },
    LabelStyle: { color: "black" },
    LogEnabled: false,
    Overlays: [],
    MaxConnections: 10,
    PaintStyle: { stroke: '#579DF6', strokeWidth: 1, joinstyle: 'round' },
    ReattachConnections: true,
    RenderMode: "svg",
    Scope: "jsPlumb_DefaultScope",
    DeleteEndpointsOnDetach: false,
    reattach: true,
  })

  return jp
}

function remover(el: HTMLElement, genner: any, jp: any) {
  const __genner = genner(el)

  if (__genner._this) {
    el.classList.remove('single-line__this')
  } else if (__genner._multiple) {
    el.classList.remove('single-line__multiple')
  } else
    el.classList.remove('single-line')

  jp.reset()

  // @ts-ignore remover
  return ([] + !![])
}

function _genner(genner: any, el: HTMLElement) {
  const [, , p] = genner()

  let _el = el

  while (_el) {
    const _ = _el.parentElement!

    if (_?.classList.contains('el-scrollbar__view')) break;
    else _el = _
  }

  return {
    have: (p?.children?.length ?? 0),
    _multiple: (p?.children instanceof Array && p?.children.length > 1),
    nextLayer: (_el?.nextElementSibling),
    quoter: (el.parentElement?.nextElementSibling)?.className.includes('TouchFlow')
  }
}

function _donner(jp: any, genner: any) {
  const [nextPoint, _] = genner()

  jp.repaint()

  if (_ && !nextPoint._point) {
    nextPoint._pointU = ((100000 + (Math.random() * 1000000)).toString(16).slice(6))
    nextPoint._point = jp.addEndpoint(nextPoint, {
      anchor: ['Top'],
      uuid: nextPoint._pointU
    })

    jp.makeTarget(nextPoint, {
      endpoint: "Dot",
      anchor: "Continuous"
    })
  }

  if (nextPoint?._conn) {
    jp.deleteConnection(nextPoint._conn)

    delete nextPoint._conn
  }
}

export const refreshLines = (root: HTMLElement, genner: any) => {
  const [, , , , , jp] = genner()
  const { have, _multiple, nextLayer, quoter } = _genner(genner, root)

  if (!nextLayer || !remover(root, genner, jp) || !have) return

  if (!_multiple) {
    if (!nextLayer.className.includes('TouchFlow')) return
    return quoter && root.classList.add('single-line')
  }

  const flows = nextLayer.querySelectorAll('.TouchFlow')

  _donner(jp, genner)

  flows.forEach((flow: Element, index: number) => {
    const nextPoint = flow.querySelector('.fake-point')!

    if (flows.length % 2 !== 0 && (index + 1) === (flows.length + 1) / 2) {
      // !nextLayer.className.includes('TouchFlow') &&
      if (!nextLayer.className.includes('TouchFlow')) return

      if (!quoter && !nextPoint.parentElement.className.includes('TouchFlow')) return

      root.classList.add('single-line')
    }

    else drawPath(root, nextPoint as HTMLElement, genner)
  })
}