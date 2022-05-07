export default {
  // 1. 设置用户名
  setUserName (state, setUserName) {
    state.user.userName = setUserName
  },
  //   监听menu是否需要变化， 变化的话那就重新渲染菜单
  setChangeMenu (state, menuStatus) {
    state.changeMenu = menuStatus
  },
  setUpdateIndex (state, status) {
    state.updateIndex = status
  },
  setLoading (state, status) {
    state.loading = status
  },
  setWebsocketChange (state) {
    state.websocketChange = state.websocketChange + 1
  },
  setwebsocketReceiveData (state, status) {
    state.websocketReceiveData = status
  },
  setWebsocket (state, status) {
    state.websocket = status
  },

  setOnlyWebsocket (state, status) {
    state.onlyWebsocket = status
  },

  setOnlywebsocketCallBackData (state, status) {
    state.onlywebsocketCallBackData = status
  },
}
