import { InterceptorManager } from "../core/interceptorManager"
import defaluts from ''

export type Method = 'get' | 'GET' | 'post' | 'POST' | 'delete' |'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'put' | 'PUT' | 'patch' | 'PATCH'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?:any
  params?:any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?:number

  [propName: string]: any
}

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  config: AxiosRequestConfig
  request: any
  headers: any
}

// axios函数返回的是一个Promise对象
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {

}

// 定义AxiosError类型接口
export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError?: boolean
}

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

// 给axios混合对象定义接口
export interface Axios {
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  interceptors:  Interceptors
  defaults: AxiosRequestConfig

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig):AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 拦截器 -- 这是对外的，只有use和eject两个方法
export interface AxiosInterceptorManager<T> {
  use(resolve: ResolveFn<T>, reject?: RejectFn): number
  eject(id: number): void
}

export interface ResolveFn<T = any> {
  (val: T): T | Promise<T>
}

export interface RejectFn {
  (error: any): any
}
