/**
 * 请求成功状态码
 */
export const SUCCESS_CODE = 0;

/**
 * 请求contentType
 */
export const CONTENT_TYPE = "application/json";

/**
 * 请求超时时间
 */
export const REQUEST_TIMEOUT = 60000;

/**
 * 不重定向白名单
 */
export const NO_REDIRECT_WHITE_LIST = ["/login"];

/**
 * 不重置路由白名单
 */
export const NO_RESET_WHITE_LIST = ["Redirect", "Login", "NoFind", "Root"];

/**
 * 表格默认过滤列设置字段
 */
export const DEFAULT_FILTER_COLUMN = ["expand", "selection"];

/**
 * 事件类型
 */
export const EVENT_TYPE = [
  {
    label: "h5事件",
    value: "h5",
  },
  {
    label: "玩法事件",
    value: "games",
  },
  {
    label: "微信公众号事件",
    value: "mp",
  },
  {
    label: "互动事件",
    value: "interaction",
  },
  {
    label: "app事件",
    value: "app",
  },
  {
    label: "自定义事件",
    value: "customize",
  },
];

/**
 * 属性数据类型
 */
export const ATTR_FIELD_TYPE = [
  {
    label: "文本型",
    value: "text",
  },
  {
    label: "数字型",
    value: "num",
  },
  {
    label: "日期型",
    value: "date",
  },
  {
    label: "布尔型",
    value: "boolean",
  },
];

/**
 * 配置中心状态常量
 */
export enum ConfigStatus {
  Available = "available",
  Offline = "offline",
}

/**
 * 人员性别
 */
export const PEOPLE_SEX = [
  {
    label: "男",
    value: "man",
  },
  {
    label: "女",
    value: "woman",
  },
];

/**
 * 人员来源
 */
export const PEOPLE_SOURCE = [
  {
    label: "手动添加",
    value: "manual",
  },
  {
    label: "活动收集",
    value: "H5",
  },
  {
    label: "第三方导入",
    value: "third",
  },
];
