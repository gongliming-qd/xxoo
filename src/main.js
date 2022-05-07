
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import $ from "jquery"
import router from './router'
import store from './store/index'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/common.less'
Vue.use(ElementUI)

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en', // 语言标识 //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh': require('./VueI18n/language-zh'),  
    'en': require('./VueI18n/language-en')
  }
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,   // 加入i18n
  components: {
    App
  },
  template: '<App/>'
})
