/**
 * DictTreeVO
 */
export type DictTreeType = {
  attrs?: AttrDict[];
  attrSearchTypes?: CommonDictVO[];
  diversionTypes?: CommonDictVO[];
  eventActions?: CommonDictVO[];
  events?: EventTypeDictVO[];
  eventTypes?: CommonDictVO[];
  fieldLogics?: string[];
  fieldOps?: string[];
  fieldTypes?: CommonDictVO[];
  labels?: CustomLabel[];
  nodeTouchTypes?: CommonDictVO[];
  nodeTypes?: CommonDictVO[];
  timeConditionTypes?: CommonDictVO[];
  [property: string]: any;
}

/**
 * CommonDictVO
 */
export type CommonDictVO = {
  /**
   * code
   */
  code?: string;
  /**
   * message
   */
  message?: string;
  [property: string]: any;
}

/**
 * AttrDict
 */
export type AttrDict = {
  /**
   * 创建人id
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 是否被删除
   */
  deleted?: boolean;
  /**
   * 说明
   */
  describe?: string;
  /**
   * 属性名
   */
  field?: string;
  /**
   * 属性编码
   */
  fieldCode?: string;
  /**
   * 属性别名
   */
  fieldName?: string;
  /**
   * 字段类型：text 文本型，num 数字型， date 日期型，boolean 布尔类型
   */
  fieldType?: string;
  /**
   * 默认枚举值
   */
  fieldValue?: { [key: string]: { [key: string]: any } };
  /**
   * 主键id
   */
  id?: number;
  /**
   * 状态：available 可用，offline 下线'
   */
  status?: string;
  /**
   * 创建人id
   */
  updatedBy?: number;
  /**
   * 更新时间
   */
  updatedTime?: Date;
  [property: string]: any;
}

/**
 * EventTypeDictVO
 */
export type EventTypeDictVO = {
  /**
   * 事件列表
   */
  events?: EventDict[];
  /**
   * 事件类型：h5 h5事件，games 玩法事件， mp 微信公众号事件，interaction 互动事件，app app事件，customize 自定义事件
   */
  eventType?: string;
  eventTypeName?: string;
  [property: string]: any;
}

/**
 * EventDict
 */
export type EventDict = {
  /**
   * 创建人id
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 是否被删除
   */
  deleted?: boolean;
  /**
   * 说明
   */
  describe?: string;
  eventAttr?: EventAttr;
  /**
   * 事件编码
   */
  eventCode?: string;
  /**
   * 事件名
   */
  eventName?: string;
  /**
   * 事件类型：h5 h5事件，games 玩法事件， mp 微信公众号事件，interaction 互动事件，app app事件，customize 自定义事件
   */
  eventType?: string;
  /**
   * 主键id
   */
  id?: number;
  /**
   * 状态：available 可用，offline 下线'
   */
  status?: string;
  /**
   * 创建人id
   */
  updatedBy?: number;
  /**
   * 更新时间
   */
  updatedTime?: Date;
  [property: string]: any;
}

/**
 * EventAttr
 */
export type EventAttr = {
  /**
   * 事件属性
   */
  attrs?: EventAttrDetail[];
  [property: string]: any;
}

/**
 * EventAttrDetail
 */
export type EventAttrDetail = {
  /**
   * 属性说明
   */
  describe?: string;
  /**
   * 属性名
   */
  field?: string;
  /**
   * 属性别名
   */
  fieldName?: string;
  /**
   * 字段类型：text 文本型，num 数字型， date 日期型，boolean 布尔类型
   */
  fieldType?: string;
  /**
   * 默认枚举值
   */
  fieldValue?: { [key: string]: { [key: string]: any } };
  [property: string]: any;
}

/**
 * CustomLabel
 */
export type CustomLabel = {
  /**
   * 创建人id
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 是否被删除
   */
  deleted?: boolean;
  /**
   * 主键id
   */
  id?: number;
  /**
   * 标签编码
   */
  labelCode?: string;
  /**
   * 标签描述
   */
  labelDesc?: string;
  /**
   * 标签名称
   */
  labelName?: string;
  /**
   * 标签来源
   */
  labelSource?: string;
  /**
   * 标签类型
   */
  labelType?: string;
  labelValue?: JsonStructListObject;
  /**
   * 类型：text 文本型，num 数字型， date 日期型
   */
  labelValueType?: string;
  /**
   * 素材状态：available 可用，offline 下线
   */
  status?: string;
  /**
   * 创建人id
   */
  updatedBy?: number;
  /**
   * 更新时间
   */
  updatedTime?: Date;
  [property: string]: any;
}

/**
 * JsonStruct«List«object»»
 */
export type JsonStructListObject = {
  /**
   * data
   */
  data?: { [key: string]: any }[];
  [property: string]: any;
}
