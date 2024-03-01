/**
 * 大部分以 _ 或 $ 等开头的数据基本上是内部数据，提交后不会保留，每次拿到数据之后需要本地重新计算
 * 其他情况会另行有所说明，内部数据是为了方便本地开发调试方便，同时有利于页面整体的完整流畅渲染。
 */

import { CustomSearchDTO } from './touch-total'

export interface IFlowHeader {
  /**
   * 内部数据：控制 FlowHeader 是否展开
   */
  _expand: false,
  touchName: "",
  disturb: IHeaderDisturb,
  target: IHeaderTarget
}

export interface IHeaderDisturb {
  /**
   * 内部数据：控制 勿扰设置 是否打开
   */
  enable: false,
  time: any,
  action: "quit" | "wait" | "giveUp",
}

export interface IHeaderTarget {
  /**
   * 内部数据：控制 目标设置 是否打开
   */
  enable: false,
  targetRuleContent: {
    data: Array<ITargetContent>
  },
  // list: Array<ITargetContent>,
}

export interface ITargetDelayed {
  delayedAction: string,
  delayedTime: number,
  delayedType: string,
  delayedUnit: string,
  isDelayed: boolean
}

export interface ITargetContent {
  targetDelayed: ITargetDelayed,
  targetRuleContent: CustomSearchDTO
}

export * from './dict-types'