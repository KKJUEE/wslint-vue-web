/*
 * axios组件二次封装
 */
import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import { Message, Loading } from 'element-ui'
// 响应时间
axios.defaults.timeout = 5 * 1000
// 配置cookie
// axios.defaults.withCredentials = true
// 配置请求头
//设置默认请求头
//axios.defaults.headers = {
//  'X-Requested-With': 'XMLHttpRequest',
//  'Access-Control-Allow-Origin': '*',
//  'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE',
//  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

// 静态资源
Vue.prototype.$static = ''

// 配置接口地址
axios.defaults.baseURL = 'http://192.168.1.125:8080'
var loadingInstance
// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use(
  config => {
    loadingInstance = Loading.service({
      lock: true,
      text: '数据加载中，请稍后...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
//  修改post请求的请求头部及请求参数处理方式
//	此处不需要，server端需要的是json数据，不需要处理为表单数据
//  if (config.method === 'post') {
//    config.data = qs.stringify(config.data)
//  }
    return config
  },
  err => {
    loadingInstance.close()
    Message.error('请求错误')
    return Promise.reject(err)
  }
)
// 返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
  res => {
  	//对于download的请求特殊处理
  	if(typeof res.data === 'string') {
  		loadingInstance.close()
      	return res
  	}
    if (res.data.code === 200) {
      loadingInstance.close()
      return res
    } else {
      loadingInstance.close()
      Message.error(res.data.msg)
    }
  },
  error => {
    loadingInstance.close()
    //code的处理
    if (error && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '错误请求'
          break;
        case 401:
          err.message = '未授权，请重新登录'
          break;
        case 403:
          err.message = '拒绝访问'
          break;
        case 404:
          err.message = '请求错误,未找到该资源'
          break;
        case 405:
          err.message = '请求方法未允许'
          break;
        case 408:
          err.message = '请求超时'
          break;
        case 500:
          err.message = '服务器端出错'
          break;
        case 501:
          err.message = '网络未实现'
          break;
        case 502:
          err.message = '网络错误'
          break;
        case 503:
          err.message = '服务不可用'
          break;
        case 504:
          err.message = '网络超时'
          break;
        case 505:
          err.message = 'http版本不支持该请求'
          break;
        default:
          err.message = `连接错误${err.response.status}`
      }
    } else {
      err.message = "连接到服务器失败"
    }
    message.error(err.message)
  	return Promise.resolve(error.response)
  }
)
// 发送请求
export function fetchPost (url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(
        res => {
          resolve(res.data)
        },
        err => {
          reject(err.data)
        }
      )
      .catch(err => {
        reject(err.data)
      })
  })
}
export function fetchGet (url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
//params会拼接到url中，而data是放在body中
export function fetchDelete (url, params) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        data: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}