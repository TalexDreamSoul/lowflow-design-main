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

export function validateSingleCondition(condition: object) {
  const res = JSON.stringify(condition)?.length > 5

  if (!res) {
    console.log(condition, 'none')
  }
  return res
}

export function validateConditions(conditions: Array<any>): boolean {
  return [...conditions].filter((condition: any) => {
    if (condition.conditions) {
      return !validateObjConditions(condition)
    }
    return !validateSingleCondition(condition)
  })?.length === 0
}

export function validateObjConditions(obj: any) {
  return validateConditions(obj?.conditions)
}

export function validateCustomerAttributes(customRuleContent: any) {
  const { customAttr, customEvent, eventSequence } = customRuleContent

  return validateObjConditions(customAttr) && validateObjConditions(customEvent) && validateObjConditions(eventSequence)
}