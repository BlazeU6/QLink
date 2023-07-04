import { AxiosRequestConfig } from "./types";

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common:{
      Accept: 'application/json,text/plain,*/*'
    }
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

export default defaults;
