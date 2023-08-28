import {
  transformRequest as processRequest,
  transformResponse as processResponse
} from './helper/data'
import { processHeaders } from './helper/header'
import { AxiosRequestConfig } from './types'

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json,text/plain,*/*'
    }
  },
  transformRequest: [
    function(data: any, headers?: any): any {
      processHeaders(headers, data)
      return processRequest(data)
    }
  ],
  transformResponse: [
    function(data: any): any {
      return processResponse(data)
    }
  ],
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  validateStatus(status: number): boolean {
    return status >= 200 && status < 300
  }
}

const methodWithoutData = ['delete', 'get', 'head', 'options']
const methodWithData = ['post', 'put', 'patch']

methodWithoutData.forEach(method => {
  defaults.headers[method] = {}
})

methodWithData.forEach(method => {
  defaults.headers[method] = {
    'content-type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
