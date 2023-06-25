import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "../types"
import xhr from "./xhr"
import { buildURL } from "../helper/url"
import { transformRequest, transformResponse } from "../helper/data"
import { processHeaders } from "../helper/header"

// 实现URL参数处理逻辑
function transformUrl(config: AxiosRequestConfig): string{
  const { url, params } = config
  return buildURL(url!, params)
}

// 实现请求body处理逻辑
function transformRequestData(config: AxiosRequestConfig):string {
  const { data } = config
  return transformRequest(data)
}

// 实现请求headers处理逻辑
function transformHeaders(config: AxiosRequestConfig): any{
  const { headers = {}, data }  = config
   return processHeaders(headers, data)
}

// 处理config
function processConfig(config: AxiosRequestConfig): void{
  config.url = transformUrl(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

//处理响应的data
function transformResponseData (res: AxiosResponse):  AxiosResponse{
  res.data = transformResponse(res.data)
  return res
}

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise{
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}
