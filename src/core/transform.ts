import { AxiosTransformer } from "../types";

// 处理这些转换函数的调用逻辑
export default function transform(
  data: any,
  headers?: any,
  fns?: AxiosTransformer | AxiosTransformer[] // fns代表一个或多个转换函数，每个转换函数返回的data会作为下一个转换函数的参数data传入
): any{
  if(!fns){
    return data
  }
  if(!Array.isArray(fns)){
    fns = [fns]
  }
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}
