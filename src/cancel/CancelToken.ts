import { CancelExecutor } from "../types"

interface ResolveFn {
  (reason?: string ): void
}

export default class CancelToken {
  promise: Promise<string | undefined>
  result?: string

  constructor(executor: CancelExecutor){
    let resolveFn: ResolveFn
    // 初始化一个pending状态的Promise对象
    this.promise = new Promise<string | undefined>(resolve => {
      resolveFn = resolve
    })

    executor(message => {
      if(this.result){
        return
      }
      this.result = message
      resolveFn(this.result)
    })
  }
}
