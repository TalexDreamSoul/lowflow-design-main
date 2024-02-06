import { reactive } from "vue";

const SPACE_GAP_X = 40;
const SPACE_GAP_Y = 10;

function transformNode(node: any, position: any) {
  return {
    id: node.nodeId,
    parentNode: node.father?.nodeId,
    type: node.nodeType,
    position,
    data: reactive(node),
    draggable: false,
    // expandParent: true
  }
}

function transformEdge(source: string, target: string) {
  return {
    id: `e${source}-${target}`,
    source,
    target,
    type: 'smoothstep'
  }
}


function analyzeNodes(p: any) {
  let _p = [p]
  const arr: Array<any> = []
  const edges: Array<any> = []

  const pos = {
    x: 0,
    y: 0
  }

  while (_p?.length) {

    // BFS

    [..._p].forEach(child => {
      const node = transformNode(child, {
        x: 0, //pos.x,
        y: 0 //pos.y
      })

      if (child.father) {
        edges.push(transformEdge(child.father.nodeId, child.nodeId))
      }

      arr.push(node)

      pos.x += SPACE_GAP_X
    })

    pos.x = 0
    pos.y += SPACE_GAP_Y

    _p = _p.flatMap(child => child.children)

  }


  return [arr, edges]
}


export function createNodes(p: any) {

  return analyzeNodes(p)
}