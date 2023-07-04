import { AxiosInstance, AxiosRequestConfig } from "./types"
import Axios from './core/Axios'
import { extend } from "./helper/utils"
import defaults from "./defaults"

function createInstance(config: AxiosRequestConfig) {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)
 // instance本身是一个函数，又拥有了Axios上的所有原型方法
  return instance as AxiosInstance
}
const axios = createInstance(defaults)

export default axios
