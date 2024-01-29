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
 * 表格默认过滤列设置字段
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
