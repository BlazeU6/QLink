// axios({
//     method: 'post',
//     url: '/base/post',
//     headers: {
//       'content-type': 'application/json;charset=utf-8'
//     },
//     data: {
//       a: 1,
//       b: 2
//     }

import { isPlainObject } from "./utils";

// 请求 header 属性是大小写不敏感的，要把header属性名规范化
function normalizeheadersName(headers: any, normalizeName: string): void{
    if(!headers)return
    Object.keys(headers).forEach(name => {
        if(name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()){
            headers[normalizeName] = headers[name]
            delete headers[name]
        }
    })
}

export function processHeaders(headers: any, data: any): void {
    normalizeheadersName(headers, 'Content-Type')
    if(isPlainObject(data)){
        if(headers && !headers['Content-Type']){
            headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }
    return headers
}

export function parseHeader(headers: string): any {
  let parsedHeader = Object.create(null)
  headers.split('\r\n').forEach(line => {
    let [key,value] = line.split(':')
    key = key.trim().toLowerCase()

    if(!key)return
    if(value)value = value.trim()

    parsedHeader[key] = value
  })
  return parsedHeader
}


