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
   * 素材类型：sms 短信，appPush app消息，digital 数字员工，outbound 智能外呼，znx 站内信
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
   * 场景码
   */
  sceneCode?: string;
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
   * 字段
   */
  field?: string;
  /**
   * 字段名
   */
  fieldName?: string;
  /**
   * 索引
   */
  index?: string;
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
  /**
   * 类型 1：基础属性 2：客户标签
   */
  type?: string;
  /**
   * 变量值
   */
  variables?: VariableDTO[];
  [property: string]: any;
}

/**
 * VariableDTO
 */
export type VariableDTO = {
  /**
   * 比较值
   */
  compareValue?: string;
  /**
   * 默认值
   */
  defaultValue?: string;
  /**
   * 关系
   */
  fieldOp?: string;
  /**
   * 设置值
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
   * 触达类型：message 消息，addFriend 添加好友
   */
  type?: string;
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
   * 场景码
   */
  sceneCode?: string;
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