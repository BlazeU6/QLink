import { AxiosResponse, AxiosRequestConfig } from "../types";

export class AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
  isAxiosError?: boolean

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
  ){
    super(message)

    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true

    // 某些内置对象（如Error）来说，由于它们的特殊实现，单纯使用 extends 关键字可能会导致实例化后的子类对象丢失原型链或出现其他意外问题。
    // 设置对象原型，确保正确继承关系，
    // 使用 Object.setPrototypeOf() 函数可以在运行时修改子类实例的原型，从而确保子类实例正确地继承了内置对象的原型链
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
) {
  return new AxiosError(message, config,code, request, response)
}
