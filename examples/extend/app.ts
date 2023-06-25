import axios from "../../src/index"

// axios({
//   url: '/extend/post',
//   method: 'post',
//   data: {
//     msg: 'hi'
//   }
// })

// axios.request({
//   url: '/extend/post',
//   method: 'post',
//   data: {
//     msg: 'hello'
//   }
// })

// axios.get('/extend/get')

// axios.options('/extend/options')

// axios.delete('/extend/delete')

// axios.head('/extend/head')

// axios.post('/extend/post', {msg: 'post'})

// axios.put('/extend/put', {msg: 'put'})

// axios.patch('/extend/patch', {msg: 'patch'})

// 测试是否支持函数重载
// axios({
//   url: '/extend/post',
//   method: 'post',
//   data: {
//     msg: 'hihihi'
//   }
// })

// axios('/extend/post', {
//   method: 'post',
//   data: {
//     msg: 'hello'
//   }
// })

// 测试 -- 响应数据支持泛型参数
interface ResponseData<T = any> {
  code: number
  message: string
  result: T
}

interface User {
  name: string
  age: number
}

function getUser<T>() {
  return axios<ResponseData<T>>('/extend/user')
      .then(res => res.data)
      .catch(err => console.log(err))
}

async function test(){
  const user = await getUser<User>()
  if(user) console.log(user.result.name)
}
test()
