import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
// 加载全局样式
import './styles/index.scss'
import VueCookies from 'vue-cookies'
// import Storage from 'vue-ls'
// import config from '@/config/config'

Vue.use(ElementUI)
Vue.use(VueCookies)
// Vue.use(Storage, config.storageOptions)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
