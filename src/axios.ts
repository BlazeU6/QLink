import { AxiosInstance } from "./types"
import Axios from './core/Axios'
 import { extend } from "./helper/utils"

function createInstance() {
  const context = new Axios()
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)
 // instance本身是一个函数，又拥有了Axios上的所有原型方法
  return instance as AxiosInstance
}
const axios = createInstance()

export default axios
