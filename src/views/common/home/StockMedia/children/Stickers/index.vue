<template>
  <div class="Gifs">
    <div class="SetInput">
      <!-- /videos/photos/GlFs/stickers -->
      <el-input
        ref="searchInput"
        v-model="search"
        :class="{historyInput: statusSearchUi === 'showHistory'}"
        placeholder="Search stickers"
        @keyup.enter.native="gifByInputChange"
        @input="changeSearch"
        @focus="focusSearch"
        @blur="blurSearch"
        maxlength="50"
        clearable
      >
      </el-input>
      <div class="setSearchIcon">
        <img
          src="@/assets/img/stockmedia/search.svg"
          alt=""
        >
      </div>
      <div
        class="history"
        v-if="statusSearchUi === 'showHistory'"
      >
        <div class="controlRencnt">
          <div class="leftTitle">Rencnt</div>
          <img
            class="deleICon"
            src="@/assets/img/stockmedia/Delete.svg"
            @click="clearAllHistory"
          >
        </div>
        <div class="flexHistory">
          <div
            v-for="(tag, index) in historyTags"
            :key="index"
            :type="tag"
            closable
            class="singleTag"
            @click="clickHistorySingle(tag)"
          >
            <span class="singleHistory">
              <Tool-tip
                :content="tag"
                placement="bottom"
              ></Tool-tip>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="fromTitle">
      <span class="leftIntro">POWERED BY </span>
      <img
        src="@/assets/img/stockmedia/GIPHY.svg"
        alt=""
      >
    </div>
    <!-- hot部分 -->
    <div v-if="hot">
      <div
        class="topHot"
        v-show="hotOrSearch === '0'"
        v-infinite-scroll="Hotload"
      >
        <div
          class="singleItemImg"
          v-for="(item, index) in HotList"
          :key="index"
          :class="{active:item.active}"
          @click="clickSingleItem(item)"
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
              <div
                class="reflash"
                @click="hotReload"
              ></div>
            </div>
          </el-image>
          <div
            class="bottonIcon"
            v-if="item.preview_url"
          >
            <div @click.stop="singleDownloadClick(item)">
              <img
                v-if="!item.downLoad"
                class="posTop"
                :src="require('@/assets/img/DownloadIcon.svg')"
                alt=""
              >
              <img
                v-else-if="item.downLoad === 'loading'"
                class="posLoadingTop"
                :src="require('@/assets/img/stockmedia/downloadLoading.svg')"
                alt=""
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- search部分 -->
    <div
      v-if="hotOrSearch === '1'"
      class="topHot"
      v-infinite-scroll="Searchload"
    >
      <div
        class="singleItemImg"
        v-for="(item, index) in searchList"
        :key="index"
        :class="{active:item.active}"
        @click="clickSearchSingleItem(item)"
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
            <img src="@/assets/img/stockmedia/imgError.svg">
          </div>
        </el-image>
        <div class="bottonIcon">
          <div @click.stop="singleSearchDownloadClick(item)">
            <img
              class="posTop"
              :src="!item.downLoad? require('../../../../../../assets/img/DownloadIcon.svg'):''"
              alt=""
            >
          </div>

        </div>
      </div>
    </div>
    <noneShow v-show="hotOrSearch === '1' && searchList.length === 0 && inSearch && !noNetWork"></noneShow>
    <noNetwork
      v-show="noNetWork"
      @linkTo="linkTo"
    ></noNetwork>
    <div
      class="loading"
      v-if="loading"
    >
      <img
        width="16px"
        src="@/assets/gif/loading.gif"
        alt=""
      >
    </div>
  </div>
</template>

<script>
import { gifsSearch, gifsTrending, stickersSearch, stickersTrending } from '@/api/other'
import ToolTip from '@/components/toolTip/index.vue'
import noneShow from "../../components/noneShow.vue"
import noNetwork from "../../components/noNetwork.vue"

export default {
  data () {
    return {
      search: "",
      noNetWork: false,
      hot: true,
      focusBlurStatus: 'blur',
      statusSearchUi: 'common', // common(普通) , showHistory（显示历史记录）
      clearStatus: false, // 防止清空历史记录历史记录框会消失
      inSearch: false,
      historyTags: [],
      hotOrSearch: '0',   // 0 : hot , 1:search
      searchList: [],
      searchOffset: 0,
      loading: true,
      // hot部分 ----
      HotList: [],
      Hotoffset: 0,
      HotScrollloading: false
    }
  },
  activated () {
    this.closeActive()
  },
  watch: {
    '$store.state.updateIndex' () {
      // 防止首次进入页面不支持无限滚动
      setTimeout(() => {
        if (this.$store.state.updateIndex === 1) {
          this._initData()
        }
      }, 1000)
    }
  },
  created () {
    let clipsHistoryList = localStorage.getItem("clipsHistoryList") || []
    console.log(clipsHistoryList);
    this.historyTags = clipsHistoryList.split("&&&&")
  },
  methods: {
    // 初始化数据
    _initData () {
      this.HotList = []
      this.Hotoffset = 0
      this.HotScrollloading = false
      this.$nextTick(() => {
        this.getGifHot()
      })
    },
    // 情况选中状态
    closeActive () {
      this.HotList.forEach(item => {
        item.active = false
      })
      this.searchList.forEach(item => {
        item.active = false
      })
    },
    // 点击历史记录
    async clickHistorySingle (item) {
      this.search = item
      console.log(this.search);
      this.searchList = []
      this.searchOffset = 0
      if (this.search.length > 0 && this.historyTags.includes(this.search)) {
        //  如果关键字有内容，且和之前的历史记录不冲突
        this.historyTags = [...this.historyTags.filter(ele => {
          if (ele !== item) return ele
        })]
        console.log(this.historyTags);
        this.historyTags.unshift(this.search)
        let historyStr = this.historyTags.join('&&&&')
        localStorage.setItem("clipsHistoryList", historyStr);
      }
      await this.searchStickers()
      // 防止没数据默认显示为空数据
      this.inSearch = true
    },
    // 清空历史记录
    clearAllHistory () {
      this.clearStatus = true
      this.historyTags = []
      localStorage.setItem("clipsHistoryList", '');
      this.$nextTick(() => {
        setTimeout(() => {
          this.clearStatus = false
          this.$refs.searchInput.focus()
        }, 200)
      })


    },
    // 控制历史记录弹窗1
    changeSearch () {
      if (this.search.length === 0 && this.focusBlurStatus === "focus") {
        this.statusSearchUi = 'showHistory'
        this.hotOrSearch = '0'
        this.inSearch = false
      }
      if (this.search.length > 0 && this.focusBlurStatus === "focus") {
        this.statusSearchUi = 'common'

      }
      if (this.search.length > 0 && this.focusBlurStatus === "blur") {
        this.statusSearchUi = 'common'
      }
      if (this.search.length === 0 && this.focusBlurStatus === "blur") {
        this.statusSearchUi = 'common'
        this.hotOrSearch = '0'
        this.inSearch = false
      }
      console.log(this.search.length, this.focusBlurStatus, this.statusSearchUi);

    },
    // 控制历史记录弹窗2
    focusSearch () {
      this.focusBlurStatus = "focus"
      this.changeSearch()
    },
    // 控制历史记录弹窗3
    blurSearch () {
      setTimeout(() => {
        if (this.clearStatus === true) {
          return
        } else {
          console.log('clearStaus', this.clearStatus);
          this.focusBlurStatus = "blur"
          this.changeSearch()
        }
      }, 200)
    },

    // 获取Stickers数据
    async searchStickers () {
      try {
        // this.$store.dispatch('setLoading', true)
        this.loading = true
        // 让input 失去焦点， 避免重复按下enter获取数据
        this.$refs.searchInput.blur()
        let res = await stickersSearch({
          api_key: 'MEMHZYMarvIsyRoBqQvInPMTLEgKG9GF',
          limit: 32,
          offset: this.searchOffset,
          q: this.search,
          lang: 'en'
        })
        console.log(res);
        if (res.status === 200 && res.data.msg === 'OK') {
          let resData = _.cloneDeep(res.data.data.data).map(item => {
            item = {
              active: false,
              downLoad: false,
              s_id:item.id,
              preview_url:item.images.preview_webp.url,
              file_url:item.images.original.mp4,
            }
            return item
          })
          this.searchList = [... this.searchList, ...resData]
          this.searchOffset = this.searchOffset + res.data.data.data.length
          // 显示search部分
          this.hotOrSearch = '1'
          this.noNetWork = false
        }
      }
      catch (error) {
        console.log(1111111111);
        this.searchList = []
        // 规避断网情况下重新有网络hot不支持无限滚动了
        this.hot = false
        this.noNetWork = 1
        console.log(this.HotList);
      }
      finally {
        // this.$store.dispatch('setLoading', false)
        this.loading = false
      }
    },
    // 无限滚动
    async Searchload () {

      if (this.HotScrollloading) return
      this.HotScrollloading = true
      await this.searchStickers()
      this.HotScrollloading = false
    },
    // 搜索框enter
    async gifByInputChange () {
      this.HotScrollloading = false
      this.searchList = []
      this.searchOffset = 0
      if (this.search.length > 0 && !this.historyTags.includes(this.search)) {
        //  如果关键字有内容，且和之前的历史记录不冲突
        this.historyTags.unshift(this.search)
        this.historyTags = this.historyTags.slice(0, 10)
        console.log(this.historyTags);
        let historyStr = this.historyTags.join('&&&&')
        localStorage.setItem("clipsHistoryList", historyStr);
      }
      await this.searchStickers()
      this.inSearch = true
    },
    // 单击active
    clickSearchSingleItem (item) {
      this.searchList.forEach(ele => {
        ele.active = false
      })
      item.active = true
    },
    // 下载
    singleSearchDownloadClick (item) {
      this.$store.dispatch('setLoading', true)
      // this.$emit('sendMessage', item)
      item.downLoad = true
      setTimeout(() => {
        this.$store.dispatch('setLoading', false)
      }, 1000)
    },
    // 热门部分 -------------------
    // 获取热门数据
    async getGifHot () {
      try {
        // this.$store.dispatch('setLoading', true)
        this.loading = true
        // 让input 失去焦点， 避免重复按下enter获取数据
        let res = await stickersTrending({
          api_key: 'MEMHZYMarvIsyRoBqQvInPMTLEgKG9GF',
          limit: 32,
          offset: this.Hotoffset,
          lang: 'en'
        })
        console.log(res);
        if (res.status === 200 && res.data.msg === 'OK') {
          let resData = _.cloneDeep(res.data.data.data).map(item => {
            item = {
              active: false,
              downLoad: false,
              s_id:item.id,
              preview_url:item.images.preview_webp.url,
              file_url:item.images.original.mp4,
            }
            return item
          })
          this.HotList = [...this.HotList, ...resData]
          this.Hotoffset = this.Hotoffset + res.data.data.data.length
          this.noNetWork = false
          this.hot = true
        }
      } catch (error) {
        this.searchList = []
        this.hot = false
        this.noNetWork = 2
      }
      finally {
        // this.$store.dispatch('setLoading', false)
        this.loading = false
      }
    },
    // 热门无限滚动
    async Hotload () {
      // console.log(this.$route);
      if (this.HotScrollloading) return
      this.HotScrollloading = true
      await this.getGifHot()
      this.HotScrollloading = false
    },
    // 热门单击active
    clickSingleItem (item) {
      this.HotList.forEach(ele => {
        ele.active = false
      })
      item.active = true
    },
    // 热门下载
    singleDownloadClick (item) {
      // this.$store.dispatch('setLoading', true)
      // this.$emit('sendMessage', item)
      console.log(item);
      item.downLoad = 'loading'
      this.$store.state.websocket.send(JSON.stringify({ 
        path: '/materialLibrary/download',
        data:{
          ...item
        }
        }))
      this.$store.state.websocket.onmessage = (evt) => {
        let obj = JSON.parse(evt.data)
        console.log(obj);
        if (obj.path === '/materialLibrary/download') {
              if(obj.result.code === 200 ){
                item.downLoad = true
              }
          }
      }
      
    },
    // 断网情况下
    async linkTo () {
      if (this.noNetWork === 2) {
        // 热门的时候
        this._initData()
        // 规避断网情况下重新有网络hot不支持无限滚动了
        this.hot = true

      } else if (this.noNetWork === 1) {
        this.Searchload()
      }
    },
    // 热门图片失败重新加载
    hotReload () {
      this.hot = false
      this.$nextTick(() => {
        this.hot = true
      })
    }

  },
  components: {
    ToolTip, noneShow, noNetwork
  }
}
</script>

<style scoped lang="less">
.Gifs {
  padding-top: 45px;
  position: relative;
  // 顶部搜索
  .SetInput {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    border-radius: 4px;
    border: 1px solid #0f0f10;
    box-sizing: border-box;
    background-color: #0f0f10;
    /deep/ .el-input__inner {
      text-indent: 16px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      background-color: #0f0f10;
      border-color: #0f0f10;
      color: #fff;
      font-family: "Helvetica Neue";
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      height: 32px;
    }
    /deep/ .el-input__suffix {
      .el-input__suffix-inner {
        border-color: none;
        .el-icon-circle-close:before {
          font-size: 0;
          background-color: red;
          content: "";
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url("~@/assets/img/stockmedia/close.svg");
        }
      }
    }
    /deep/ .el-input__inner::placeholder {
      color: #fff;
      opacity: 0.5;
      font-family: "Helvetica Neue";
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
    }
    .historyInput /deep/ .el-input__inner {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    .historyInput /deep/ .el-input__inner:focus {
      border-color: transparent !important;
      border-bottom-color: #232228 !important;
    }
    .setSearchIcon {
      position: absolute;
      top: 8px;
      left: 8px;
      font-weight: bolder;
      color: @primaryColor;
      width: 16px;
      height: 16px;
    }
    .history {
      z-index: 3;
      position: relative;
      left: 0px;
      width: 100%;
      min-height: 120px;
      background-color: #0f0f10;
      border-bottom-right-radius: 8px;
      border-bottom-left-radius: 8px;
      padding-left: 30px;
      box-sizing: border-box;
      padding: 8px 12px;
      .controlRencnt {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        .leftTitle {
          font-family: "Helvetica Neue";
          font-style: normal;
          font-weight: 400;
          font-size: 12px;
          line-height: 14px;
          color: rgba(255, 255, 255, 0.5);
        }
        .deleICon {
          cursor: pointer;
        }
      }
      .flexHistory {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        .singleTag {
          cursor: pointer;
          font-family: "Helvetica Neue";
          font-style: normal;
          font-weight: 400;
          font-size: 12px;
          line-height: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin-right: 8px;
          margin-bottom: 8px;
          padding: 3px 8px;
          background-color: #232228;
          border-radius: 4px;
          .singleHistory {
            max-width: 200px;
            display: inline-block;
          }
        }
      }
    }
  }
  .fromTitle {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .leftIntro {
      display: inline-block;
      font-family: "Circular Std";
      font-style: normal;
      font-weight: 400;
      font-size: 9px;
      line-height: 11px;
      color: rgba(255, 255, 255, 0.5);
      margin-right: 4px;
    }
  }
  // 热门部分
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
        .posLoadingTop {
          position: absolute;
          right: 0;
          top: 0;
          animation: fadenum 0.9s linear infinite;
        }
        @keyframes fadenum {
          100% {
            transform: rotate(360deg);
          }
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
      .reflash {
        position: absolute;
        width: 16px;
        height: 16px;
        right: 4px;
        top: 4px;
        background: url("~@/assets/img/stockmedia/refresh_default.svg");
        transition: all 0.3s;
        &:hover {
          background: url("~@/assets/img/stockmedia/refresh_hover.svg");
        }
      }
    }
  }
  .loading {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
  }
}
</style>
