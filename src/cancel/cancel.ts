export default class Cancel {
  message?: string

  constructor(message?: string) {
    this.message = message
  }
}

// 通过 instanceof 来判断传入的值是不是一个 Cancel 对象。
export function isCancel(value: any): boolean {
  return value instanceof Cancel
}
