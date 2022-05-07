<template>
  <div class="Downloaded">
    <div
      v-if="HotList.length>0"
      class="showList"
    >
      <div
        class="topHot"
        v-if="hot"
      >
        <div
          class="singleItemImg"
          v-for="(item, index) in HotList"
          :key="index"
          :class="{active:item.active}"
          @click="clickSingleItem(item,'click')"
          @dblclick="clickSingleItem(item,'dbclick')"
          @contextmenu="contextmenu($event, item, )"
          draggable="true"
          @dragstart="dragstart_handler($event, item)"
        >
          <el-image
            :src="item.preview_url"
            class="elImg"
            fit="cover"
            lazy
          >
            <div
              slot="placeholder"
              class="image-slot"
            >
              HitPaw
            </div>
            <div
              slot="error"
              class="image-slot"
            >
              <img
                src="@/assets/img/stockmedia/imgError.svg"
                alt=""
              >
            </div>
          </el-image>
        </div>
      </div>
    </div>
    <noneShow v-else></noneShow>
  </div>
</template>

<script>
import noneShow from "./components/noneShow.vue"
import showRightMenu from "@/components/rightClickMenu"
export default {
  data () {
    return {
      hot: true,
      HotList: [],
      menuList: [
        { id: 1, key: 'dele', className: "删除" },
      ],
      nowRightMenuSelectMenu: {

      },
      refShowRightMenu: null
    }
  },
  watch: {

    '$store.state.updateIndex': {
      // 代表滚动到stockMedia部分了
      handler: '_initWebsocket'
    }
  },
  activated () {
    this._initWebsocket()
  },
  deactivated () {
    this.refShowRightMenu.unInstall()
    setTimeout(() => {
      this.refShowRightMenu = null
    }, 200)
  },
  methods: {
    // 初始化获取数据
    _initData () {
      this.sendMessage({
        path: '/getStorage',
        type: 'materialLibraryDownloadList'
      })
    },
    async _initWebsocket () {

      await this._initData()

      this.$store.state.websocket.onmessage = (evt) => {
        let obj = JSON.parse(evt.data)
        console.log(obj);
        // 获取数据
        if (obj.path === '/getStorage' && obj.result.type === 'materialLibraryDownloadList') {
          if (obj.result.code === 200 && obj.result.status) {
            this.HotList = obj.result.data
            this.reLoad()
            // 初始化右键删除
            this.$nextTick(() => {
              console.dir(showRightMenu.methods.regiter);
              if (this.refShowRightMenu !== null) return
              this.refShowRightMenu = showRightMenu.methods.install(showRightMenu, {
                props: {
                  menuList: this.menuList
                },
                ref: 'showRightMenu',
                on: {
                  change: this.rightSelectChange
                }
              })
            })
          }

        }
        // action
        else if (obj.path === '/views/action') {
          if (obj.result.code === 200 && obj.result.status) {
            this.$message.success('action成功')
          }
        }
        else if (obj.path === '/deleteDownload') {
          if (obj.result.code === 200) {
            this.HotList = this.HotList.filter(item => {
              if (obj.result.data.s_id !== item.s_id) {
                return true
              }
            })
            this.$store.state.websocket.send(JSON.stringify({
              path: '/setStorage',
              type: 'materialLibraryDownloadList',
              data: this.HotList,
            }))
          }
        }
      }
    },
    clickSingleItem (item, status) {
      this.HotList.forEach(ele => {
        ele.active = false
      })
      item.active = true
      this.sendMessage({
        path: "/views/action",
        data: {
          ...item
        },
        type: status
      })
    },
    // 单个右键
    contextmenu (e, item) {
      e.preventDefault();
      this.nowRightMenuSelectMenu = item
      this.refShowRightMenu.show(e)
    },
    // 右键菜单确定
    rightSelectChange (item) {
      if (item.key === 'dele') {
        console.log(item, this.nowRightMenuSelectMenu);
        this.refShowRightMenu.close()
        console.log('dele');
        this.$store.state.websocket.send(JSON.stringify({
          path: '/deleteDownload',
          data: {
            ... this.nowRightMenuSelectMenu
          }
        }))
      }

    },
    // 重新加载页面
    reLoad () {
      this.hot = false
      this.$nextTick(() => {
        this.hot = true
      })
    },
    // 自动接收数据重新加载页面
    webSocketReceive () {
      let obj = this.$store.state.websocketReceiveData
      if (obj.type === 'getStockMediaDownLoad') {
        console.log(obj);
        this.HotList = obj.data
        this.reLoad()
      }
    },
    // 请求数据
    sendMessage (props) {
      this.$store.state.websocket.send(JSON.stringify({
        ...props
      }))
    },
    // 工具模块
    async dragstart_handler (ev, item) {
      console.log(item);
      if (!item.downLoad) {
      } else {
        ev.dataTransfer.setData("text", JSON.stringify(item));
        ev.effectAllowed = "copyMove";
      }

    }
  },

  components: {
    noneShow, showRightMenu
  }
}
</script>

<style scoped lang="less">
.Downloaded {
  height: 100%;
  .topHot {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
    grid-template-rows: auto;
    grid-row-gap: 12px;
    grid-column-gap: 6px;
    margin-top: 12px;
    overflow-y: auto;
    max-height: calc(100vh - 175px);
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      background-color: transparent !important;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px transparent !important;
      -webkit-box-shadow: inset 0 0 6px transparent !important;
      border-radius: 10px !important;
      background-color: transparent !important;
    }

    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      border-radius: 10px !important;
      box-shadow: inset 0 0 6px transparent !important;
      -webkit-box-shadow: inset 0 0 6px transparent !important;
      background-color: #232228 !important;
    }
    &:hover {
      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
        background-color: #252528 !important;
      }

      /*定义滚动条轨道 内阴影+圆角*/
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.3) !important;
        -webkit-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.3) !important;
        border-radius: 10px !important;
        background-color: #232228 !important;
      }

      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb {
        border-radius: 10px !important;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1) !important;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1) !important;
        background-color: #4d4a57 !important;
      }
    }
    .singleItemImg {
      width: 96px;
      height: 54px;
      background-color: #1c1a20;
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border: 1px solid #232228;
      border-radius: 4px;
      overflow: hidden;
      .elImg {
        border-radius: 4px;
      }
      &:hover {
        transition: all 0.4s;
        box-shadow: rgb(41, 89, 141) 0px 20px 30px -10px;
        .collectIcon {
          display: block !important;
        }
      }
      .bottonIcon {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 50px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        font-size: 18px;
        color: white;
        .collectIcon {
          display: none;
          transition: all 0.1s;
          position: absolute;
          left: 0;
          top: 5px;
          width: 20px;
          height: 20px;
          &:hover {
            font-size: 20px;
          }
        }
        .downloadIcon {
          transition: all 0.1s;
          position: absolute;
          right: 5px;
          top: 5px;
          width: 20px;
          height: 20px;
          &:hover {
            font-size: 20px;
          }
        }
        .posTop {
          position: absolute;
          right: 0;
          top: 0;
        }
        .iconCD.active {
          color: red;
        }
      }
    }
    .singleItemImg.active {
      border: 1px solid white;
    }
    .elImg {
      width: 94px;
      height: 54px;
    }
    .image-slot {
      width: 100%;
      height: 100%;
      background-color: #454649;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(250, 250, 250, 0.2);
      z-index: 1;
      position: relative;
      img {
        z-index: 1;
      }
    }
  }
}
</style>
