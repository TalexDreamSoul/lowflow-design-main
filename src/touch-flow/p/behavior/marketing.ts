/**
 * MarketingTouchEditDTO
 */
export type MarketingTouchEditDTO = {
  /**
   * 是否包含目标
   */
  containTarget?: boolean;
  customRuleContent?: CustomSearchDTO;
  /**
   * 勿扰-结束时间
   */
  disturbEndTime?: Date;
  /**
   * 勿扰-开始时间
   */
  disturbStartTime?: Date;
  /**
   * 勿扰配置：quit 退出流程，wait 等待触达 giveUp 放弃触达
   */
  disturbType?: string;
  /**
   * 有效时间-结束时间
   */
  endTime?: string;
  /**
   * 限制次数
   */
  enterCount?: number;
  /**
   * 限制天数
   */
  enterDay?: number;
  /**
   * 进入限制：noLimit 不限制，once：进入一次，multi：多次
   */
  enterType?: string;
  /**
   * 预估人数
   */
  estimateCount?: number;
  /**
   * 执行时间
   */
  executeTime?: Date;
  /**
   * 执行类型：immediately:定时-单次，delayed:定时-重复，trigger：触发型
   */
  executeType?: 'immediately' | 'repeat' | 'trigger';
  /**
   * 主键id
   */
  id?: number;
  /**
   * 是否勿扰：默认勿扰
   */
  isDisturb?: boolean;
  /**
   * 节点信息
   */
  nodes?: MarketingTouchNodeEditDTO[];
  /**
   * 有效时间-开始时间
   */
  startTime?: string;
  /**
   * 状态：draft 草稿，approvalPending 待审批，approvalSuccess 审批成功，approvalRefuse 审批拒绝， waitStart
   * 等待启动，running 发送中，suspend暂停，done 已结束
   */
  status?: string;
  targetRuleContent?: JsonStructListMarketingTouchTargetDTO;
  /**
   * 触达名称
   */
  touchName?: string;
  triggerRuleContent?: EventTriggerConditionDTO;
  [property: string]: any;
}

/**
 * CustomSearchDTO
 */
export type CustomSearchDTO = {
  customAttr?: CustomAttrConditionDTO;
  customEvent?: CustomEventConditionDTO;
  eventSequence?: EventSequenceConditionDTO;
  /**
   * 逻辑符号
   */
  logicalChar: string;
  [property: string]: any;
}

/**
 * CustomAttrConditionDTO
 */
export type CustomAttrConditionDTO = {
  /**
   * 搜索条件
   */
  conditions?: AttrConditionDTO[];
  /**
   * 逻辑符号
   */
  logicalChar?: string;
  [property: string]: any;
}

/**
 * AttrConditionDTO
 */
export type AttrConditionDTO = {
  /**
   * 搜索条件
   */
  conditions?: SearchCondition[];
  /**
   * 逻辑符号
   */
  logicalChar?: string;
  [property: string]: any;
}

/**
 * SearchCondition
 */
export type SearchCondition = {
  attr?: AttrDTO;
  label?: LabelDTO;
  /**
   * 类型 1：基础属性 2：客户标签
   */
  type?: string;
  [property: string]: any;
}

/**
 * AttrDTO
 */
export type AttrDTO = {
  /**
   * 结束时间
   */
  endTime?: Date;
  /**
   * 字段
   */
  field?: string;
  /**
   * 字段值
   */
  fieldMultiValue?: string[];
  /**
   * 字段名称
   */
  fieldName?: string;
  /**
   * 运算符号
   */
  fieldOp?: string;
  /**
   * 字段范围值
   */
  fieldRangeValue?: string;
  /**
   * 字段类型
   */
  fieldType?: string;
  /**
   * 字段值
   */
  fieldValue?: string;
  /**
   * 开始时间
   */
  startTime?: Date;
  [property: string]: any;
}

/**
 * LabelDTO
 */
export type LabelDTO = {
  /**
   * 标签id
   */
  labelId?: number;
  /**
   * 标签名
   */
  labelName?: string;
  /**
   * 标签值
   */
  labelValue?: { [key: string]: any }[];
  [property: string]: any;
}

/**
 * CustomEventConditionDTO
 */
export type CustomEventConditionDTO = {
  /**
   * 搜索条件
   */
  conditions?: EventConditionDTO[];
  /**
   * 逻辑符号
   */
  logicalChar?: string;
  [property: string]: any;
}

/**
 * EventConditionDTO
 */
export type EventConditionDTO = {
  /**
   * 搜索条件
   */
  conditions?: EventSearchCondition[];
  /**
   * 逻辑符号
   */
  logicalChar?: string;
  [property: string]: any;
}

/**
 * EventSearchCondition
 */
export type EventSearchCondition = {
  /**
   * 操作
   */
  action?: string;
  conditions?: AttrConditionDTO;
  /**
   * 结束时间
   */
  endTime?: Date;
  /**
   * 事件编码
   */
  eventCode?: string;
  /**
   * 事件名
   */
  eventName?: string;
  /**
   * 开始时间
   */
  startTime?: Date;
  [property: string]: any;
}

/**
 * EventSequenceConditionDTO
 */
export type EventSequenceConditionDTO = {
  /**
   * 搜索条件
   */
  conditions?: SequenceConditionDTO[];
  /**
   * 逻辑符号
   */
  logicalChar?: string;
  [property: string]: any;
}

/**
 * SequenceConditionDTO
 */
export type SequenceConditionDTO = {
  /**
   * 搜索条件
   */
  conditions?: SequenceCondition[];
  /**
   * 结束时间
   */
  endTime?: Date;
  /**
   * 逻辑符号
   */
  logicalChar?: string;
  /**
   * 开始时间
   */
  startTime?: Date;
  [property: string]: any;
}

/**
 * SequenceCondition
 */
export type SequenceCondition = {
  /**
   * 操作
   */
  action?: string;
  conditions?: AttrConditionDTO;
  /**
   * 事件编码
   */
  eventCode?: string;
  /**
   * 事件名
   */
  eventName?: string;
  [property: string]: any;
}

/**
 * MarketingTouchNodeEditDTO
 */
export type MarketingTouchNodeEditDTO = {
  /**
   * 是否包含目标
   */
  containTarget?: boolean;
  customRuleContent?: CustomSearchDTO;
  diversionRuleContent?: JsonStructListDiversionRuleDTO;
  /**
   * 执行类型：noDiversion:不分流，event:按事件，attr：按属性
   */
  diversionType?: string;
  eventDelayed?: DelayedDTO;
  eventRuleContent?: CustomSearchDTO;
  /**
   * 主键id
   */
  id?: number;
  labelContent?: LabelRuleDTO;
  nextNodeId?: JsonStructListString;
  nodeContent?: JsonStructObject;
  nodeDelayed?: DelayedDTO;
  /**
   * 节点ID
   */
  nodeId?: string;
  /**
   * 节点名称
   */
  nodeName?: string;
  /**
   * 节点类型：strategy 策略，diversion 分流，subDiversion 分流子节点
   */
  nodeType?: string;
  /**
   * 前一个节点ID
   */
  preNodeId?: string;
  targetDelayed?: DelayedDTO;
  targetRuleContent?: MarketingTouchTargetDTO;
  /**
   * 营销触达ID
   */
  touchId?: number;
  touchTemplateContent?: MaterialTemplateEditDTO;
  /**
   * 触达消息模版id
   */
  touchTemplateId?: string;
  /**
   * 触达消息类型
   */
  touchType?: string;
  [property: string]: any;
}

/**
 * JsonStruct«List«DiversionRuleDTO»»
 */
export type JsonStructListDiversionRuleDTO = {
  /**
   * data
   */
  data?: DiversionRuleDTO[];
  [property: string]: any;
}

/**
 * DiversionRuleDTO
 */
export type DiversionRuleDTO = {
  /**
   * 分支名
   */
  branchName?: string;
  /**
   * 分支流量占比
   */
  branchRatio?: number;
  /**
   * 分支id
   */
  nodeId?: string;
  [property: string]: any;
}

/**
 * DelayedDTO
 */
export type DelayedDTO = {
  /**
   * 延时动作
   */
  delayedAction?: string;
  /**
   * 延时时间
   */
  delayedTime?: number;
  /**
   * 延时类别
   */
  delayedType?: string;
  /**
   * 延时单位
   */
  delayedUnit?: string;
  /**
   * 是否延时
   */
  isDelayed?: boolean;
  [property: string]: any;
}

/**
 * LabelRuleDTO
 */
export type LabelRuleDTO = {
  /**
   * 标签id
   */
  labelId?: number;
  /**
   * 标签名
   */
  labelName?: string;
  /**
   * 标签值
   */
  labelValue?: { [key: string]: any }[];
  [property: string]: any;
}

/**
 * JsonStruct«List«string»»
 */
export type JsonStructListString = {
  /**
   * data
   */
  data?: string[];
  [property: string]: any;
}

/**
 * JsonStruct«object»
 */
export type JsonStructObject = {
  /**
   * data
   */
  data?: { [key: string]: any };
  [property: string]: any;
}

/**
 * MarketingTouchTargetDTO
 */
export type MarketingTouchTargetDTO = {
  targetDelayed?: DelayedDTO;
  targetRuleContent?: CustomSearchDTO;
  [property: string]: any;
}

/**
 * MaterialTemplateEditDTO
 */
export type MaterialTemplateEditDTO = {
  appPushTemplate?: AppPushTemplateDTO;
  digitalTemplate?: DigitalTemplateDTO;
  /**
   * 模版名称
   */
  id?: number;
  /**
   * 模版名称
   */
  name?: string;
  outboundTemplate?: OutboundTemplateDTO;
  smsTemplate?: SmsTemplateDTO;
  /**
   * 素材状态：available 可用，offline 下线
   */
  status?: string;
  /**
   * 素材类型：sms 短信，app app消息，digital 数字员工，outbound 智能外呼，znx 站内信
   */
  type?: string;
  znxTemplate?: ZnxTemplateDTO;
  [property: string]: any;
}

/**
 * AppPushTemplateDTO
 */
export type AppPushTemplateDTO = {
  /**
   * 素材内容
   */
  content?: string;
  /**
   * 内容变量
   */
  contentVariables?: VariableTemplateDTO[];
  /**
   * 跳转类型：app:跳转到APP原生页，booth：跳转到APP展位
   */
  jumpAppType?: string;
  /**
   * 跳转地址
   */
  pageLink?: string;
  /**
   * 标题
   */
  title?: string;
  /**
   * 标题变量
   */
  titleVariables?: VariableTemplateDTO[];
  [property: string]: any;
}

/**
 * VariableTemplateDTO
 */
export type VariableTemplateDTO = {
  /**
   * 默认值
   */
  defaultValue?: string;
  /**
   * 字段
   */
  field?: string;
  /**
   * 字段名
   */
  fieldName?: string;
  /**
   * 字段值
   */
  fieldValue?: string;
  [property: string]: any;
}

/**
 * DigitalTemplateDTO
 */
export type DigitalTemplateDTO = {
  digitalTemplateDetails?: DigitalTemplateDetailDTO[];
  [property: string]: any;
}

/**
 * DigitalTemplateDetailDTO
 */
export type DigitalTemplateDetailDTO = {
  /**
   * 素材内容
   */
  content?: string;
  /**
   * 图片链接
   */
  imgUrl?: string;
  /**
   * 变量列表
   */
  variables?: VariableTemplateDTO[];
  [property: string]: any;
}

/**
 * OutboundTemplateDTO
 */
export type OutboundTemplateDTO = {
  /**
   * 外呼唯一标志
   */
  outboundCode?: string;
  /**
   * 变量列表
   */
  variables?: VariableTemplateDTO[];
  [property: string]: any;
}

/**
 * SmsTemplateDTO
 */
export type SmsTemplateDTO = {
  /**
   * 素材内容
   */
  content?: string;
  /**
   * 变量列表
   */
  variables?: VariableTemplateDTO[];
  [property: string]: any;
}

/**
 * ZnxTemplateDTO
 */
export type ZnxTemplateDTO = {
  /**
   * 轮播图ID
   */
  carouselId?: string;
  /**
   * 列表标题
   */
  listTitle?: string;
  /**
   * 模块ID
   */
  moduleId?: string;
  /**
   * 列表标题变量
   */
  titleVariables?: VariableTemplateDTO[];
  /**
   * 站内信简介
   */
  znxContent?: string;
  /**
   * 站内信简介变量
   */
  znxContentVariables?: VariableTemplateDTO[];
  /**
   * 站内信标题
   */
  znxTitle?: string;
  /**
   * 内容变量
   */
  znxTitleVariables?: VariableTemplateDTO[];
  [property: string]: any;
}

/**
 * JsonStruct«List«MarketingTouchTargetDTO»»
 */
export type JsonStructListMarketingTouchTargetDTO = {
  /**
   * data
   */
  data?: MarketingTouchTargetDTO[];
  [property: string]: any;
}

/**
 * EventTriggerConditionDTO
 */
export type EventTriggerConditionDTO = {
  /**
   * 延时时间
   */
  delayedTime?: number;
  /**
   * 延时单位
   */
  delayedUnit?: string;
  eventA?: CustomSearchDTO;
  eventB?: CustomSearchDTO;
  [property: string]: any;
}