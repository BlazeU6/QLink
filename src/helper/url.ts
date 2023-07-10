import { isDate, isPlainObject } from "./utils"

function encode(val: string): string{
  return encodeURIComponent(val)
  .replace(/%40/g, '@')
  .replace(/%3A/gi, ':')
  .replace(/%24/g, '$')
  .replace(/%2C/gi, ',')
  .replace(/%20/g, '+')
  .replace(/%5B/gi, '[')
  .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string{
    if(!params)return url;

    // params: {
    //     foo: ['bar', 'baz']
    // }

    // params: {
    //     foo: {
    //       bar: 'baz'
    //     }
    // }

    const parts: string[] = []
    Object.keys(params).forEach(key => {
        let val = params[key]
        if(val === null || typeof val === 'undefined')return;

        let values: string[]
        if(Array.isArray(val)){
            values = val
            // 这里的key是foo
            key += '[]'
        }else{
            values = [val]
        }

        values.forEach(val => {
            if(isDate(val)){
                val = val.toISOString()
            }else if(isPlainObject(val)){
                val = JSON.stringify(val)
            }
            parts.push(`${encode(key)}=${encode(val)}`)
        })
    })

    let serializedParams = parts.join('&')
    if(serializedParams){
      // 不携带hash
      const hashIndex = url.indexOf('#')
      if(hashIndex !== -1) url = url.slice(0,hashIndex)

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
    }
    return url
}
