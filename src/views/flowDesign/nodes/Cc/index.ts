import { FlowNode } from '../Node/index'
import {FormProperty} from "~/views copy/flowDesign/index";
export interface CcNode extends FlowNode {
    users: string[]
    // 表单字段
    formProperties: FormProperty[]
}