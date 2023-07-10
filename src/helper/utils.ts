const toString = Object.prototype.toString

export function isDate(val: any): val is Date{
  return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object{
//   return val !== null && typeof val === 'object'
// }

export function isPlainObject(val: any): val is Object{
  return toString.call(val) === '[object Object]'
}


// extend 的最终目的是把 from 里的属性都扩展到 to 中，包括原型上的属性。
export function extend<T, U>(to: T, from: U): T & U {
  for(const key in from){
    (to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

export function deepClone(...objs: any[]): any {
  // objs是一个数组，里面有两个对象
  const result = Object.create(null)
  objs.forEach(obj => {
    if(obj){
      Object.keys(obj).forEach(key => {
        const val = obj[key]

        if(isPlainObject(val)){
          // 判断result中是否已经有了这个值
          if(isPlainObject(result[key])){
            result[key] = deepClone(result[key], val)
          }else{
            result[key] = deepClone({}, val)
          }
        }else{
          result[key] = val
        }
      })
    }
  })
  return result
}
