import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

import ElementUI from 'element-ui';
// 如果需要全局使用，可能很多页面里面都会用到这个组件，那么就把下面这两句代码放到main.js中
// const ElTreeGrid = require('element-tree-grid');
// Vue.component(ElTreeGrid.name, ElTreeGrid)

import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/index.css';

Vue.use(ElementUI);

// 全局axios默认值//参考github
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';

// 通过default给axios设置一个默认的拦截器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers.Authorization = localStorage.getItem("token")
  return config;
});

// Add a response interceptor
// axios.interceptors.response.use(function (response) {
//   // Do something with response data
//   return response;
// }, function (error) {
//   // Do something with response error
//   return Promise.reject(error);
// });

// 把axios加到Vue的原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false;
// 注册一个导航守卫
router.beforeEach((to, from, next) => {
  // 判断用户访问的页面是否是登录页面，如果是登录页面则放行
  if (to.path === "/login") {
    next()
    return
  }
  // 如果访问的是其他页面，判断用户是否进行了登录
  if (localStorage.getItem("token")) {
    next()
  } else {
    router.push("/login")
  }
  // console.log(to, from);
  // console.log("导航守卫工作啦");
})

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");