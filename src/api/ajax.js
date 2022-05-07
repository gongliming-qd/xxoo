import axios from 'axios'
import Vue from 'vue'
// import Router from '../router/index'
import qs from 'qs'
// import lodash from 'lodash'
var apiServe = require('../../config/apiServe')
// 每次请求携带cookies信息
axios.defaults.withCredentials = true

//
let baseURL = ''
process.env.NODE_ENV === 'development' ? baseURL = apiServe.prodServe : baseURL = apiServe.prodServe
export const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 请求拦截器
http.interceptors.request.use(function (config) {
  config.data = qs.stringify(config.data)
  //  携带token
  // config.headers.Authorization = window.sessionStorage.getItem('token')

  // get数组封装
  if (config.method === 'get') {
    // 1.  params是数组类型如arr=[1,2]，则转换成arr=1&arr=2,不转换会显示为arr[]=1&arr[]=2
    config.paramsSerializer = function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
  return config
})

// 添加响应拦截器
http.interceptors.response.use( response => {
  // 对响应数据做点什么
  // if(response.data.results.message == 'token验证不通过' && response.data.state == 'false'){
  //     Vue.prototype.$message.warning('请重新登录哦!')
  //     Router.push('/login')
  // }else{
  //     return response;
  // }
  return response
},
error => {
     
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.response.data.data?  Vue.prototype.$message.error(error.response.data.data): Vue.prototype.$message.error(error.response.data.message)
        break;
      case 401: //没有登陆
        //跳转回login路由，并把目标路由的url路径保存在login的query中,以便登陆后跳回来
        Message.error("Unauthorized request, please sign in!");
        Router.push("/login");
        window.localStorage.removeItem("token");
        window.sessionStorage.removeItem("token");
        break;
      case 403:
        error.response.data.data? Vue.prototype.$message.error(error.response.data.data): Vue.prototype.$message.error(error.response.data.message)
        break;
      case 500:
        error.response.data.data? Vue.prototype.$message.error(error.response.data.data): Vue.prototype.$message.error(error.response.data.message)
        break;
      default:
        Vue.prototype.$message.error('Server error!');
    }
  } else {
    Vue.prototype.$message.error("Error network, please try again later");
    throw error;
  }
  }
)
