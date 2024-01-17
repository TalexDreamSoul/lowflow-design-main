import { FlowNode } from '../Node/index'
import { FormProperty } from "~/views copy/flowDesign/index";
export interface StartNode extends FlowNode {
    // 表单字段
    formProperties: FormProperty[],
    conditions: FilterRules,
    def: boolean


}



export interface ErrorInfo {
    showError: boolean,
    message: string
}


/**
 * 筛选规则
 */
export interface FilterRules {
    logicalOperator: 'or' | 'and',
    conditions: Condition[]
    groups: FilterRules[]
}

/**
 * 字段筛选结果
 */
export interface Condition {
    // 筛选字段
    field: string | null,
    // 条件运算符
    operator: string,
    // 筛选值
    value: any | null
}
