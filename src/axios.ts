import { AxiosRequestConfig, AxiosStatic } from "./types"
import Axios from './core/Axios'
import { extend } from "./helper/utils"
import defaults from "./defaults"
import mergeConfig from "./core/mergeConfig"

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)
  // instance本身是一个函数，又拥有了Axios上的所有原型方法
  return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = function create(config) {
  // 把参数 config 与 defaults 合并，作为新的默认配置
  return createInstance(mergeConfig(defaults, config))
}

export default axios
