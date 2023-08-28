import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helper/url'
import { flattenHeaders } from '../helper/flattenHeaders'
import transform from './transform'

export function isAbsoluteUrl(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineUrl(baseURL: string, relativeUrl?: string): string {
  return relativeUrl ? baseURL.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '') : baseURL
}

// 实现URL参数处理逻辑
function transformUrl(config: AxiosRequestConfig): string {
  let { url, params, baseURL } = config
  if (baseURL && !isAbsoluteUrl(url!)) {
    url = combineUrl(baseURL, url)
  }
  return buildURL(url!, params)
}

// 处理config
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  // 把对请求数据的处理和对响应数据的处理改成使用 transform 函数实现
  config.data = transform(config.data, config.headers, config.transformRequest)
  // 经过合并后的配置中的headers是一个复杂对象，多了common、post、get等属性，需要拍平
  config.headers = flattenHeaders(config.headers, config.method!)
}

//处理响应的data
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // 发送请求之前先检查一下cancelToken是否已经被用过了，如果已经被用过了则不用发请求，直接抛异常
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}
