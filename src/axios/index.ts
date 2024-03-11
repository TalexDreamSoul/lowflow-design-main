import service from './service'
import { CONTENT_TYPE } from '~/constants'
import { AxiosResponse, RequestConfig } from './types'

const request = (option: RequestConfig<AxiosResponse<any, any>>) => {
  const { url, method, params, data, headers, responseType } = option
  return service.request({
    url: url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      'Content-Type': CONTENT_TYPE,
      ['Authorization']: '',
      ...headers
    }
  })
}

export default {
  get: <T = any>(option: RequestConfig<AxiosResponse<any, any>>) => {
    return request({ method: 'get', ...option })
  },
  post: <T = any>(option: any) => {
    return request({ method: 'post', ...option })
  },
  delete: <T = any>(option: RequestConfig<AxiosResponse<any, any>>) => {
    return request({ method: 'delete', ...option })
  },
  put: <T = any>(option: RequestConfig<AxiosResponse<any, any>>) => {
    return request({ method: 'put', ...option })
  },
  cancelRequest: (url: string | string[]) => {
    return service.cancelRequest(url)
  },
  cancelAllRequest: () => {
    return service.cancelAllRequest()
  }
}
