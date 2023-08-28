import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeader } from '../helper/header'
import { createError } from '../helper/error'
import { isURLSameOrigin } from '../helper/url'
import cookieObj from '../helper/cookie'
import { isFormData } from '../helper/utils'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      method = 'get',
      url,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      validateStatus
    } = config

    // 处理非200状态码
    function handleResponse(response: AxiosResponse): void {
      // 如果没有配置 validateStatus 以及 validateStatus 函数返回的值为 true 的时候，都认为是合法的
      // 合法则正常 resolve(response)，否则都创建一个错误。
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }

    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }

      if (withCredentials) {
        request.withCredentials = withCredentials
      }

      if (timeout) {
        request.timeout = timeout
      }
    }

    function addEvents(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) return

        if (request.status === 0) return

        const responseHeaders = parseHeader(request.getAllResponseHeaders())
        const responseData =
          responseType && responseType !== 'text' ? request.response : request.responseText

        const response: AxiosResponse = {
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
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
        reject(new Error('Network Error'))
      }

      // 处理超时错误
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
        reject(new Error(`Timeout of ${timeout} ms exceeded`))
      }

      // 上传进度监控
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      // 下载进度监控
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeader(): void {
      // 如果请求的数据是FormData类型，则需要主动删除请求中的Content-Type字段，让浏览器自动根据请求的数据设置content-Type
      // 比如：当我们通过 FormData 上传文件的时候，浏览器会把请求 headers 中的 Content-Type 设置为 multipart/form-data。
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      // 同源或非同源但withCredentials为true时获取cookie中的xsrfCookieName
      if ((isURLSameOrigin(url!) || withCredentials) && xsrfCookieName) {
        const xsrfValue = cookieObj.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      // 当传入的data为空时，请求头中的content-type是没有意义的，所以要删除
      for (let key in headers) {
        if (data === null && key.toLowerCase() === 'content-type') {
          delete headers[key]
        } else {
          request.setRequestHeader(key, headers[key])
        }
      }
    }

    function processCancel(): void {
      // 取消请求
      if (cancelToken) {
        cancelToken.promise.then(res => {
          request.abort()
          reject(res)
        })
      }
    }

    // 整个流程分为 7 步：
    // 1、创建一个request实例
    const request = new XMLHttpRequest()
    // 2、执行open初始化
    request.open(method.toUpperCase(), url!, true)

    // 3、执行 configureRequest 配置 request 对象。
    configureRequest()
    // 4、执行 addEvents 给 request 添加事件处理函数。
    addEvents()
    // 5、执行 processHeaders 处理请求 headers。
    processHeader()
    // 6、执行 processCancel 处理请求取消逻辑。
    processCancel()

    // 7、执行 request.send 方法发送请求。
    request.send(data)
  })
}
