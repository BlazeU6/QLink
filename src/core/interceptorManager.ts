import { ResolveFn, RejectFn } from "../types"

interface Interceptor<T> {
  resolved: ResolveFn<T>
  rejected?: RejectFn
}

export class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor(){
    this.interceptors = []
  }

  use(resolved: ResolveFn<T>, rejected?: RejectFn):number {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1
  }

  eject(id: number): void {
    if(this.interceptors[id]){
      // 不能直接删除，因为直接删除会破坏顺序，导致后面的拦截器的ID发生变化
      this.interceptors[id] = null
    }
  }

  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if(interceptor !== null){
        fn(interceptor)
      }
    })
  }
}
