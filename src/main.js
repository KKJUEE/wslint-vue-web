import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import axios from 'axios' //引入axios 
//import Mock from './mock'
//Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
//导入全局组件
import htmlpanel from './components/upload'
import '../static/css/temCss.css' /*引入公共样式*/

import { fetchGet, fetchPost, fetchDelete} from './api/axiosConfig'

//引入axios
require('./api/mock')

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(Vuex)
//调用的是htmlpanel里面的组件
Vue.use(htmlpanel)

Vue.prototype.$ajax=axios //修改Vue的原型属性
Vue.prototype.$get = fetchGet
Vue.prototype.$post = fetchPost
Vue.prototype.$delete = fetchDelete

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
store,
	axios,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

