// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import vueAxios from 'vue-axios'
import router from './router'
import store from './store/stores.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
// import 'xlsx'
// import 'flex.css'
Vue.use(vueAxios, axios)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.config.devtools = true
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type']= 'application/x-www-form-urlencoded;charset=utf-8'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
