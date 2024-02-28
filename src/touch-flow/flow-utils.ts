import { toRefs } from "vue";
import { dictFilterTree } from "~/api/index";

export async function getDictAnalyzedTree() {
  const dict = await dictFilterTree();
  const { data: res } = dict;

  const { attrs, labels } = res;

  const _attrs = attrs.map((attr: any) => {
    return {
      label: attr.fieldName,
      value: attr.field,
      ...attr,
    };
  });

  const _labels = labels.map((label: any) => {
    const children: any = [];
    if (label.labelValue) {
      [...label.labelValue.data].forEach((item) => {
        children.push({
          label: item,
          value: item,
          ...label,
        });
      });
    }

    return {
      label: label.labelName,
      children,
      ...label,
    };
  });

  return [
    [
      {
        label: "用户属性",
        value: "attr",
        children: _attrs,
      },
      {
        label: "用户标签",
        value: "label",
        children: _labels,
      },
    ],
    dict,
  ];
}

export function _delChild(parent: any, child: any) {
  const { children } = toRefs(parent);
  if (!children) return false;

  const index = children.value.indexOf(child);
  return index > -1 ? children.value.splice(index, 1) && true : false;
}

export function delChild(child: {
  father: any;
  children: any[];
  [key: string]: any;
}) {
  return _delChild(child.father, child);
}

export interface IFlowUtils {
  delChild: (child: any) => boolean;
}

export function validateSingleCondition(condition: object) {
  const res = JSON.stringify(condition)?.length > 5;

  if (!res) {
    console.log(condition, "none");
  }
  return res;
}

export function validateConditions(conditions: Array<any>): boolean {
  return (
    [...conditions].filter((condition: any) => {
      if (condition.conditions) {
        return !validateObjConditions(condition);
      }
      return !validateSingleCondition(condition);
    })?.length === 0
  );
}

export function validateObjConditions(obj: any) {
  return validateConditions(obj?.conditions);
}

export function validateCustomerAttributes(customRuleContent: any) {
  const { customAttr, customEvent, eventSequence } = customRuleContent;

  return (
    validateObjConditions(customAttr) &&
    validateObjConditions(customEvent) &&
    validateObjConditions(eventSequence)
  );
}

export interface PropIgnoreConfiguration {
  // Supported by object
  validate: (key: any, val: any) => boolean
}

export interface ValidatePropConfiguration {
  ignores: {
    [props: string]: PropIgnoreConfiguration;
  }
}

export function validatePropValue(val: any, configuration?: {
  ignores: {
    [props: string]: PropIgnoreConfiguration
  }
}): boolean {
  if (!val) return false;

  // 判断是否是数字
  if (Number.isNaN(val)) return false;
  if (Number.isInteger(val)) {
    return true;
  }

  // 判断是否是文本
  if (typeof val === "string") {
    return val?.length > 0;
  }

  // 判断是否是数组
  if (Array.isArray(val)) {
    if (val?.length < 1) return false;
    return [...val].filter(key => !validatePropValue(key, configuration))?.length < 1;
  }

  // 判断是否是对象
  if (typeof val === "object") {
    return Object.getOwnPropertyNames(val).filter(key => {
      const res = configuration?.ignores?.[key]?.validate?.(key, val[key]) ?? true

      if ( key !== undefined )
      console.log("key", key, res)

      return !res || !validatePropValue(val[key], configuration)
    })?.length < 1;
  }

  // 判断是否是函数
  if (typeof val === "function") {
    return validatePropValue(val(), configuration);
  }

  // 判断是否是布尔值
  if (typeof val === "boolean") {
    return true;
  }

  return false;
}

export function genIdNodeReactive(p: any) {
  return function (id: string) {
    const stack: any[] = [p]

    while (stack.length) {
      const node = stack.pop()

      if (node.id === id) {
        return node
      }

      if (node.children) {
        stack.push(...node.children)
      }
    }

    return null
  };
}

export function flatConvert2Tree(nodes: any[]) {
  const map = new Map<String, any>();

  const root: any[] = [];

  [...nodes].forEach((item: any) => map.set(item.nodeId, item));

  [...nodes].forEach((item: any) => {
    const { preNodeId, nextNodeId } = item

    if (preNodeId) {
      const preNode = map.get(preNodeId)
      if (preNode) {
        console.log("__preNode", preNode, preNodeId)

        preNode.children = [...(preNode.children || []), item]

        return
      }

    }

    root.push(item)
  })

  return root
}