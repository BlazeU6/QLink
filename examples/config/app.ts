import axios, { AxiosTransformer } from "../../src/index"
import qs from "qs"

// axios.defaults.headers.common['test2'] = 123

// axios({
//   url: '/config/post',
//   method: 'post',
//   data: qs.stringify({
//     a: 1
//   }),
//   headers: {
//     test: '321'
//   }
// }).then(res => {
//   console.log(res.data)
// })


// 测试transformRequest和reansformResponse
// axios({
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1
//   },
//   transformRequest: [
//     function(data) {
//       // 执行它默认的 transformRequest 之前，先用 qs.stringify 库对传入的数据 data 做了一层转换
//       return qs.stringify(data)
//     },
//     ...(axios.defaults.transformRequest as AxiosTransformer[])
//   ],

//   transformResponse: [
//     ...(axios.defaults.transformResponse as AxiosTransformer[]),
//     function (data) {
//       // 在执行完默认的 transformResponse 后，会给响应的 data 对象添加一个 data.test = 'xyz'
//       if(typeof data === 'object') {
//         console.log('!!!!')
//         data.test = 'xyz'
//       }
//       return data
//     }
//   ]
// }).then(res => {
//   console.log(res.data)
// })

// 测试axios.create
const instance = axios.create({
  transformRequest: [
    function (data) {
      return qs.stringify(data)
    },
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],

  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
    function (data) {
      if(typeof data === 'object'){
        data.create = 'abc'
      }
      return data
    }
  ]
})

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
})
.then(res => {
  console.log(res.data)
})
