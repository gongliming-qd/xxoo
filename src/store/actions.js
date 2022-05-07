export default {
  setUserName ({
    commit
  }, userName) {
    commit('setUserName', userName)
  },
  //   监听menu是否需要变化， 变化的话那就重新渲染菜单
  setChangeMenu ({
    commit
  }, menuStatus) {
    commit('setChangeMenu', menuStatus)
  },
  setUpdateIndex ({
    commit
  }, status) {
    commit('setUpdateIndex', status)
  },
  setLoading ({
    commit
  }, status) {
    commit('setLoading', status)
  },
  setWebsocketChange ({
    commit
  }) {
    commit('setWebsocketChange')
  },
  setwebsocketReceiveData ({
    commit
  }, status) {
    commit('setwebsocketReceiveData', status)
  },
  setWebsocket ({
    commit
  }, status) {
    commit('setWebsocket', status)
  },


  setOnlyWebsocket ({
    commit
  }, status) {
    commit('setOnlyWebsocket', status)
  },
  setOnlywebsocketCallBackData ({
    commit
  }, status) {
    commit('setOnlywebsocketCallBackData', status)
  },
}
