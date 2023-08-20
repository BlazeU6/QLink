import axios, { Canceler } from "../../src/index"

const cancelToken = axios.cancelToken
const source = cancelToken.source()

axios.get('/cancel/get', {
    cancelToken: source.token
}).catch(err => {
    if (axios.isCancel(err)){
        console.log('Request canceled', err.message)
    }
})

setTimeout(() => {
    source.cancel('Operation canceled by the user （第一个请求取消）')

    setTimeout(() => {
        // 这里测试之前携带的cancelToken已经用过的情况下，这个post请求是否还能发的出去
        axios.post(
            '/cancel/post',
            { a: 1 },
            { cancelToken: source.token }
        ).catch(err => {
            if (axios.isCancel(err)) {
                console.log(err.message, '@@@@@')
            }
        })
    }, 500);
}, 1000)


let cancel: Canceler
axios.get('/cancel/get', {
    cancelToken: new cancelToken(c => {
        cancel = c
    })
}).catch(err => {
    if(axios.isCancel(err)) {
        console.log('Request canceled', err.message)
    }
})

setTimeout(() => {
    cancel('第二个请求取消')
},2000)