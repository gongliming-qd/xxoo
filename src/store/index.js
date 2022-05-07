// 1. 导入vue和vuex
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
// 2. 导入分别的功能
import state from './state'
import mutations from './mutations'
import actions from './actions'

// 3. 注册vuex
Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer(val) {
    return {
      user: val.user,
      changeMenu: val.changeMenu,
    }
}
})

// 4. 创建vuex对象
export default new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [
    vuexLocal.plugin
  ]
})
