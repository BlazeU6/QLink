import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "../types"
import { parseHeader } from "../helper/header"
import { createError } from "../helper/error"

export default function xhr(config: AxiosRequestConfig): AxiosPromise{
  return new Promise((resolve,reject) => {
    const { data = null, method = 'get', url, headers, responseType, timeout, cancelToken } = config
    const request = new XMLHttpRequest()

    if(responseType){
      request.responseType = responseType
    }

    request.open(method.toUpperCase(), url!, true)

    // 处理非200状态码
    function handleResponse (response: AxiosResponse): void {
      if(request.status >= 200 && request.status < 300){
        resolve(response)
      }else{
        reject(createError(
          `Request failed with status code ${response.status}`,
          config,
          null,
          request,
          response
        ))
      }
    }

    //
    request.onreadystatechange = function handleLoad() {
      if(request.readyState !== 4) return

      if(request.status === 0) return

      const responseHeaders = parseHeader(request.getAllResponseHeaders())
      const responseData = responseType && responseType !== 'text' ? request.response : request.responseText

      const response:  AxiosResponse = {
        data: responseData,
        headers: responseHeaders,
        status: request.status,
        statusText: request.statusText,
        config,
        request
      }
      handleResponse(response)
    }

    // 处理网络异常
    request.onerror = function handleError(){
      reject(createError(
        'Network Error',
        config,
        null,
        request
      ))
      reject(new Error('Network Error'))
    }

    if(timeout)request.timeout = timeout
    // 处理超时错误
    request.ontimeout = function handleTimeout(){
      reject(createError(
        `Timeout of ${timeout} ms exceeded`,
        config,
        'ECONNABORTED',
        request
      ))
      reject(new Error(`Timeout of ${timeout} ms exceeded`))
    }

    // 当传入的data为空时，请求头中的content-type是没有意义的，所以要删除
    for(let key in headers){
      if(data === null && key.toLowerCase() === 'content-type'){
        delete headers[key]
      }else{
        request.setRequestHeader(key, headers[key])
      }
    }

    // 取消请求
    if(cancelToken){
      cancelToken.promise.then(res => {
        request.abort()
        reject(res)
      })
    }

    request.send(data)
  })
}
