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
