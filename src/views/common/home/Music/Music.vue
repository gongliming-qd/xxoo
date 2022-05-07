<template>
  <lm-menu-scroll
    ref="lmmenuscroll"
    :MenuData="MenuData"
    :updateIndex="updateIndex"
    :active="0"
    :Collection="`收藏`"
    activeMenuColor="#fff"
  >
    <template v-slot:headerInsert="{item}">
      <div class="headerSet">
        <div>
          xxxooo
        </div>
      </div>
    </template>
    <template v-slot:singleItem="{item}">
      <div
        class="singleItemImg"
        :class="{active:item.son.active}"
        @click="(e)=>{clickSingleItem(e, item.son, item.gFather)}"
      >
        <el-image
          class="elImg"
          :src="item.son.preview_url"
          lazy
        ></el-image>
        <div class="topRightIcon">
          <!-- <div @click.stop="singleColloctClick(item)">
                <i
                  class="el-icon-star-on collectIcon iconCD"
                  :class="{active:item.son.collect}"
                ></i>
              </div> -->
          <div @click.stop="singleDownloadClick(item)">
            <img
              class="posTop"
              :src="!item.son.downLoad? require('../../../../assets/img/DownloadIcon.svg'):''"
              alt=""
            >
          </div>

        </div>
        <div class="timeShowIcon">
          {{timeTransformations(item.son.duration)}}
        </div>
        <div class="topLeftIcon">
          <img
            src="../../../../assets/img/MusicIcon.svg"
            alt=""
          >
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
import { timeTransformation } from "@/util/common"

import lmMenuScroll from "../../../../../packages/index"
import ToolTip from "@/components/toolTip/index.vue"
import _ from 'lodash'

export default {
  data () {
    return {
    }
  },
  watch: {
    MenuData: {
      handler: () => {

      }
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
    }
  },
  methods: {
    // 单击单个
    clickSingleItem (e, item, gFather) {
      console.log(gFather);
      gFather.children.forEach(ele => {
        ele.children.forEach(ele1 => {
          ele1.active = false
        })
      })
      item.active = true
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
    // 单击下载
    async singleDownloadClick (item) {
      this.$store.dispatch('setLoading', true)

      console.log(item);
      item.son.downLoad = true

      let arr = this.DataList.map(ele => {
        return ele.map(ele2 => {
          if (ele2.id === item.gFather.id) {
            return item.gFather
          } else {
            return ele2
          }
        })
      })
      await this.$emit('update:DataList', arr)
      this.$store.state.websocket.send(JSON.stringify({ type: 'setAllStorage', data: [...this.DataList] }))
      this.$store.state.websocket.onmessage = (evt) => {
        let obj = JSON.parse(evt.data)
        if (obj.type === 'setAllStorage') {
          console.log(obj);
        }
      }

      setTimeout(() => {
        this.$store.dispatch('setLoading', false)
      }, 1000)
    },
    timeTransformations (item) {
      return timeTransformation(item)
    }
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
  .topRightIcon {
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
  .timeShowIcon {
    position: absolute;
    width: 36px;
    height: 14px;
    left: 4px;
    bottom: 4px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    font-size: 12px;
    color: white;
  }
  .topLeftIcon {
    position: absolute;
    left: 0px;
    top: -1px;
  }
}
.singleItemImg.active {
  border: 1px solid white;
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
