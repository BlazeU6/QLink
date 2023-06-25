import { AxiosRequestConfig, AxiosPromise, Method, AxiosResponse, ResolveFn, RejectFn } from "../types";
import dispatchRequest  from "./dispatchRequest"
import { InterceptorManager } from "./interceptorManager";

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolveFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectFn
}

export default class Axios {
  interceptors:  Interceptors

  constructor(){
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }
  request(url: any, config?: any): AxiosPromise {
    // 这里用到了函数重载
    if(typeof url === 'string'){
      // config可能不传
      if(!config){
        config = {}
      }
      config.url = url
    }else{
      // 这里说明传入的就是单个参数，且此处的形参url就是config
      config = url
    }

    const chain: PromiseChain<any>[] = [{
      resolved: dispatchRequest,
      rejected: undefined
    }]

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)
    while(chain.length){
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  // 不携带data
  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig){
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  // 携带data
  _requestMethodWithData(method: Method, url: string, data: any, config?: AxiosRequestConfig){
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}
