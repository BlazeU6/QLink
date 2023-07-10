import { deepClone } from "../helper/utils";
import { isPlainObject } from "../helper/utils";
import { AxiosRequestConfig } from "../types";

// 默认合并策略
function defaultStrategy(val1: any, val2: any): any{
  // 如果自定义配置中定义了某个属性，就采用自定义的，否则采用默认配置
  return typeof val2 !== 'undefined' ? val2 : val1
}

function formVal2Strategy(val1: any, val2: any): any{
  if(typeof val2 !== 'undefined'){
    return val2
  }
}

// 合并策略函数的映射 后面要根据不同字段来采用何种合并策略函数
const strategyMap = Object.create(null)

// 对于'url', 'params', 'data'这些属性，它是和每个请求强相关的，只能从自定义配置中获取
const strategyFormVal2 = ['url', 'params', 'data']

strategyFormVal2.forEach(key => {
  strategyMap[key] = formVal2Strategy
})

// 复杂对象合并策略
function deepMergeStrategy(val1: any, val2: any): any {
  if(isPlainObject(val2)) {
    return deepClone(val1, val2)
  }else if(typeof val2 !== 'undefined'){
    return val2
  }else if(isPlainObject(val1)){
    return deepClone(val1)
  }else if(typeof val1 !== 'undefined'){
    return val1
  }
}

const strategyKeysDeepMerge = ['headers']
strategyKeysDeepMerge.forEach(key => {
  strategyMap[key] = deepMergeStrategy
})

export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
  if(!config2) {
    config2 = {}
  }
  const config = Object.create(null)

  for(let key in config2){
    mergeFiled(key)
  }
  for(let key in config1){
    if(!config2[key]){
      mergeFiled(key)
    }
  }

  function mergeFiled(key: any): void{
    // 针对不同的属性使用不同的合并策略
    const strategy = strategyMap[key] || defaultStrategy
    // config1代表默认配置，config2代表自定义配置
    config[key] = strategy(config1[key], config2![key])
  }
  return config
}
