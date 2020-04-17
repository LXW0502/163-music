// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible'//移动端自适应

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import '@/assets/css/reset.scss'//初始化
import '@/assets/font-awesome/css/font-awesome.min.css'//引入字体图标
Vue.use(MintUI)//全局组建使用

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
