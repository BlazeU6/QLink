import { isDate, isPlainObject } from './utils'

interface URLOrigin {
  protocol: string
  host: string
}

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) return url

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
    if (val === null || typeof val === 'undefined') {
      return
    }
    let values: string[]
    if (Array.isArray(val)) {
      values = val
      // 这里的key是foo
      key += '[]'
    } else {
      values = [val]
    }

    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')
  if (serializedParams) {
    // 不携带hash
    const hashIndex = url.indexOf('#')
    if (hashIndex !== -1) url = url.slice(0, hashIndex)

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

// 同域名的判断方法：
// 创建一个 a 标签的 DOM，然后设置 href 属性为我们传入的 url，然后可以获取该 DOM 的 protocol、host。
// 当前页面的 url 和请求的 url 都通过这种方式获取，然后对比它们的 protocol 和 host 是否相同即可。
const resolveURL = (url: string): URLOrigin => {
  const urlParseNode = document.createElement('a')
  urlParseNode.setAttribute('href', url)
  const { protocol, host } = urlParseNode
  return {
    protocol,
    host
  }
}

export function isURLSameOrigin(requestUrl: string): boolean {
  // 当前所在的URL
  const currentOrigin = resolveURL(document.location.href)
  const parsedOrigin = resolveURL(requestUrl)
  // 判断域名和协议
  return (
    parsedOrigin.host === currentOrigin.host && parsedOrigin.protocol === currentOrigin.protocol
  )
}
