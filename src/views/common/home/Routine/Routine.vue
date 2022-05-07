<template>
  <lm-menu-scroll
    ref="lmmenuscroll"
    :MenuData="MenuData"
    :updateIndex="updateIndex"
    :active="0"
    :Collection="`收藏`"
    :needHeaderInsert="false"
    activeMenuColor="#fff"
  >
    <template v-slot:headerInsert="{item}">
      <div class="headerSet">
        11111
      </div>
    </template>
    <template v-slot:singleItem="{item}">
      <div
        class="singleItemImg"
        :class="{active:item.son.active}"
        @click="(e)=>{clickSingleItem(e, item)}"
        draggable="true"
        @dragstart="dragstart_handler($event, item)"
        @error="imageError(item)"
        @load="imageload(item)"
      >
        <el-image
          class="elImg"
          :src="item.son.preview_url_show?item.son.preview_url_show:item.son.preview_url"
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
            <div
              class="reflash"
              @click.stop="reflashAll(item)"
            ></div>
          </div>
        </el-image>
        <div
          class="bottonIcon"
          v-if="item.son.preview_url"
        >
          <div @click.stop="singleDownloadClick(item)">
            <img
              v-if="!item.son.downLoad"
              class="posTop"
              :src="require('@/assets/img/DownloadIcon.svg')"
            >
            <img
              v-else-if="item.son.downLoad === 'loading'"
              class="posLoadingTop"
              :src="require('@/assets/img/stockmedia/downloadLoading.svg')"
              alt=""
            >
          </div>
        </div>
      </div>
      <div
        v-if="subSingleTitle"
        class="subSingleTitle"
      >
        <Tool-tip :content="item.son.className"></Tool-tip>
      </div>
    </template>
  </lm-menu-scroll>
</template>

<script>
import lmMenuScroll from "../../../../../packages/index"
import ToolTip from "@/components/toolTip/index.vue"
import _ from 'lodash'
import { creactAjax, hasId } from "@/util/common"

export default {
  data () {
    return {
    }
  },
  props: {
    MenuData: {
    },
    updateIndex: {
    },
    subSingleTitle: {
      type: Boolean,
      default: false
    },
    DataList: {
      type: Array
    },
    needHeaderInsert: {
      type: Boolean,
      default: false
    },
    DataDownList: {
      type: Array
    }
  },
  watch: {
    '$store.state.updateIndex' () {

    }
  },
  methods: {
    // 全部active取消
    closeActive (gFather) {
      gFather.children.forEach(ele => {
        ele.children.forEach(ele1 => {
          ele1.active = false
        })
      })
    },
    // 单击单个
    clickSingleItem (e, item) {
      this.closeActive(item.gFather)
      item.son.active = true
      // 如果图片加载失败，做局部刷新
      if (!item.son.showSuccess) {
        this.reflashAll(item)
        return
      }
      // 已下载用提交事件,没下载先下载
      if (!item.son.downLoad) {
        this.singleDownloadClick(item)
      } else {
        item.son.active = true
        creactAjax({
          path: "/views/action",
          data: {
            ...item
          },
          type: "click"
        }, (obj) => {
          console.log('action 成功');
        })
      }
    },
    // 单个下载
    singleDownloadClick (item) {
      console.log(item);
      item.son.downLoad = 'loading'
      creactAjax({
        path: '/download',
        data: {
          ...item.son
        }
      }, async (obj) => {
        // 接受下载
        if (obj.path === '/download') {
          if (obj.result.code === 200 && obj.result.status) {
            // 遍历修改所有的数据
            item.son.downLoad = true
            await this.$emit('changeDataList', obj.result.data.adressArr)
            // 存储后台保存的数据
            this.$emit('saveAllData')
            let copydata = this.$props.DataDownList

            let lengthData = copydata.filter((ele => {
              if (ele.s_id === obj.result.data.s_id) {
                return true
              } else {
                return false
              }
            }))

            if (lengthData.length === 0) {
              let arr = [...this.$props.DataDownList]
              arr.unshift(obj.result.data)
              this.$parent.setNowDownloadList(arr)
              this.$parent.changeReadyDownloadList(arr)
            }
          }
        }
      })
    },
    // 拖拽
    async dragstart_handler (ev, item) {
      console.log(item);
      if (!item.son.downLoad) {
        this.singleDownloadClick(item)
        ev.preventDefault();
      } else {
        ev.dataTransfer.setData("text", JSON.stringify(item.son));
        ev.effectAllowed = "copyMove";
      }

    },
    // 单击收藏
    singleColloctClick (item) {
      console.log(item);
      if (item.son.idState && item.son.collect) {
        // 点击的是收藏的地方
        // 操作收藏部分
        let arr = item.gFather.children[0].children
        let arrState = arr.filter(ele => {
          return item.son.idState !== ele.idState
        })
        item.gFather.children[0].children = []
        item.gFather.children[0].children = [...arrState]
        // 操作内容部分
        let idList = item.son.idState.split('-')
        item.son.collect = false

      } else {
        // 点击的是内容部分
        let idState = `${item.gFather.id}-${item.father.id}-${item.son.id}`
        if (item.son.collect) {
          // 去掉收藏列表中的
          let arr = item.gFather.children[0].children
          let arrState = arr.filter(ele => {
            return idState !== ele.idState
          })
          item.gFather.children[0].children = []
          item.gFather.children[0].children = [...arrState]
          item.son.collect = false
        } else {
          item.son.collect = true
          item.son.idState = idState

          item.gFather.children[0].children.push(item.son)
        }
      }


    },
    reflashAll (item) {
      item.gFather.children.forEach(ele => {
        ele.children.forEach(ele1 => {
          if (!ele.showSuccess) {
            if (ele1.preview_url_show.includes('?')) {
              ele1.preview_url_show = ele1.preview_url_show.split('?')[0] + '?' + Math.random()
            } else {
              ele1.preview_url_show = ele1.preview_url_show + '?' + Math.random()

            }
          }
        })
      })
    },
    imageError (item) {
      item.showSuccess = false
    },
    imageload (item) {
      item.showSuccess = true
    },
  },
  components: {
    lmMenuScroll, ToolTip
  }
}
</script>

<style scoped lang="less">
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
.subSingleTitle {
  cursor: pointer;
  width: 88px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  padding-top: 4px;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
