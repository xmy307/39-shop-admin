import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/index.css';

Vue.use(ElementUI);

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