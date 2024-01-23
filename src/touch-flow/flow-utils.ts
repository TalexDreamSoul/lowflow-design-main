import { toRefs } from "vue"

export function _delChild(parent: any, child: any) {

  const { children } = toRefs(parent)
  if (!children) return false

  const index = children.value.indexOf(child)
  return index > -1 ? (children.value.splice(index, 1)) && true : false
}

export function delChild(child: { father: any, children: any[], [key: string]: any }) {
  return _delChild(child.father, child)
}

export interface IFlowUtils {
  delChild: (child: any) => boolean
}