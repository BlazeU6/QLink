import { deepClone } from "./utils"

export function flattenHeaders(headers: any, method: Method): any {
  if(!headers){
    return headers
  }

  headers = deepClone(headers['common'] || {}, headers[method] || {}, headers)

  const methodToDelete = ['common', 'delete', 'get', 'head', 'options', 'post', 'put', 'patch']

  methodToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
