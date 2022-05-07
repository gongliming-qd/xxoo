<template>
  <div class="centerBody">
    <!-- 二级按钮 -->
    <div class="leftMenu">
      <Menu
        ref="Menu"
        :MenuList.sync="secondMenuList"
        :updateIndex="updateIndex"
        :activeMenuColor="activeMenuColor"
        @clickTitle="secondMenuChange"
        @clickSub="secondContentChange"
      ></Menu>
    </div>
    <div class="rightContent">
      <Common
        v-if="currentView === 'Common'"
        ref="common"
        :commonData="commonData"
        :updateIndex="updateIndex"
        :needHeaderInsert="needHeaderInsert"
        @scrollSetMenu="scrollSetMenu"
        @MenuScrollAnimate="MenuScrollAnimate"
        :Collection="Collection"
      >
        <template v-slot:headerInsert>
          <slot
            name="headerInsert"
            :item="commonData"
          ></slot>
        </template>
        <template v-slot:singleItem="{item}">
          <slot
            name="singleItem"
            :item="item"
          ></slot>
        </template>
      </Common>
    </div>
  </div>
</template>

<script>
// 导入组件
// 1. 左侧菜单
import 'jquery'
import Menu from './children/menu/menu.vue'
import Common from './children/common/common.vue'
import _ from 'lodash'
export default {
  name: 'lmMenuScroll', // 组件的name属性（后面有提到这里有个坑）
  data () {
    return {
      secondMenuList: [],
      currentView: "Common",
      commonData: {
        id: 1,
        children: []
      }
    }
  },
  watch: {
    'updateIndex': {
      handler: '__init',
      deep: true
      // immediate: true
    }
  },
  props: {
    MenuData: {
      type: Array,
      default: () => {
        return []
      }
    },
    active: {
      type: 0,
      default: 0
    },
    Collection: {
      type: String,
      default: '收藏'
    },
    activeMenuColor: {
      type: String,
      default: '#8372ff'
    },
    updateIndex: {
      type: Number
    },
    needHeaderInsert: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 点击二级菜单标题
    secondMenuChange (item) {
      console.log(item)
      this.commonData = item
      if (item.children) {
        this.$refs.common.scrollItem(item.children[this.active], 'first')
      }
    },
    // 点击二级子菜单
    secondContentChange (item, father, index) {
      // 位置滚动
      this.$refs.common.scrollItem(item, index)
    },
    // 菜单设置对应样式
    scrollSetMenu (father, son) {
      this.$refs.Menu._clickSub(father, son)
    },
    // 菜单滚动到对应位置
    MenuScrollAnimate (nowIndex) {
      this.$refs.Menu._scrollAnimate(nowIndex)
    },
    __init () {
      this.secondMenuList = this.MenuData
      console.log(this.MenuData)
      this.commonData = this.secondMenuList[0]
      this.$nextTick(() => {
        this.secondMenuChange(this.secondMenuList[this.active])
      })
    }
  },
  components: {
    Menu,
    Common
  }
}
</script>

<style scoped lang="less">
// /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
// ::-webkit-scrollbar {
//   width: 7px;
//   height: 7px;
//   background-color: #252528;
// }

// /*定义滚动条轨道 内阴影+圆角*/
// ::-webkit-scrollbar-track {
//   box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
//   -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
//   border-radius: 10px;
//   background-color: #252528;
// }

// /*定义滑块 内阴影+圆角*/
// ::-webkit-scrollbar-thumb {
//   border-radius: 10px;
//   box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
//   -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
//   background-color: #6a6a6c;
// }

.centerBody {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  padding-right: 8px;
  box-sizing: border-box;

  .leftMenu {
    width: 112px;
    height: 100%;
    overflow-y: overlay;
    padding: 8px 8px;
    box-sizing: border-box;
    border-right: 1px solid #000;
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
  }
  .rightContent {
    flex: 1;
    height: 100%;
    overflow-y: overlay;
    box-sizing: border-box;
    padding: 10px 0px 10px 10px;
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
  }
}
</style>
