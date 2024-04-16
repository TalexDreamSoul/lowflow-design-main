import { AxiosResponse, InternalAxiosRequestConfig } from './types'
import { ElMessage, ElLoading } from 'element-plus'
import qs from 'qs'
import { SUCCESS_CODE, SessionLost_CODE } from '~/constants'
import { reactiveMessage } from "~/utils/mention/mention";

let loadingInstance: any

const startLoading = () => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: 'Loading',
    fullscreen: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
};

const endLoading = () => {
  if (loadingInstance) {
    loadingInstance.close();
  }
};

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  startLoading();  // 请求开始时显示loading
  if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  }
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}

const defaultResponseInterceptors = (response: AxiosResponse) => {
  endLoading();  // 请求结束时关闭loading
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  } else if (response.data.code == SUCCESS_CODE) {
    return response.data
  } else {
    if (response?.data?.code === SessionLost_CODE) {
      // 判断当前不是登录页面时才进行提示和跳转
      if (!window.location.href.includes('/login')) {
        const [promise] = reactiveMessage('会话失效', '您的会话已失效，请重新登录！', false);
        promise.then(() => {
          window.location.href = '/login';
        });
      }
    }

    if (response.config.url?.indexOf('addMarketingTouch.do') !== -1) return response.data
    else ElMessage.error(response?.data?.message)
  }
}
// 请求超时处理函数
const requestTimeoutHandler = (error: any) => {
  if (error.code === 'ECONNABORTED') {
    ElMessage.error('请求超时，请重试');
    endLoading(); // 超时时关闭loading
  }
  return Promise.reject(error);
};

export { defaultResponseInterceptors, defaultRequestInterceptors, requestTimeoutHandler }
