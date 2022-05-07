<template>
  <div ref="secondMenu">
    <div
      class="secondMenuSub"
      v-for="item in secondMenuList"
      :key="item.id"
    >
      <!-- 头部 -->
      <div
        class="secondMenuHeader"
        :class="{active:item.active}"
        :style="{'color':item.active? activeMenuColor:''}"
        @click="clickTitle(item)"
      >
        <i
          class="el-icon-caret-right fontSet"
          :class="{none:!item.icon}"
        ></i>
        <Tool-tip
          :content="item.className"
          placement="right"
        ></Tool-tip>
      </div>
      <!-- 子项 -->
      <template v-if="item.active">
        <div
          class="secondMenuContent"
          :class="{active:ele.active && item.active}"
          :style="{'color':(ele.active && item.active)? activeMenuColor:''}"
          v-for="(ele, index) in item.children"
          :key="ele.id"
          @click="clickSub(item, ele)"
        >
          <i class="el-icon-caret-right fontSet"></i>
          <Tool-tip
            :content="ele.className"
            placement="right"
          ></Tool-tip>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import _ from "lodash"

import ToolTip from '@/components/toolTip/index.vue'

export default {
  name: 'Menu1', // 组件的name属性（后面有提到这里有个坑）
  data () {
    return {
      secondMenuList: [],
      ArrOffsetTop: [],
      activeIndex: 0,
      activeSecondIndex: 0
    }
  },
  props: {
    MenuList: {
      type: Array
    },
    activeMenuColor: {
      type: String,
      default: '#fff'
    },
    updateIndex: {
      type: Number
    }
  },

  mounted () {
    this.secondMenuList = _.cloneDeep(this.MenuList)
  },
  methods: {

    // 一级二级公共操作部分
    commonAction (item) {
      // 1. 默认关闭全部，再打开当前的
      this.secondMenuList.forEach(ele => {
        ele.active = false
        ele.children.forEach(ele2=>{
          ele2.active = false
        }) 
      })
      item.active = true
      // 2. 子元素默认激活第一个
    },
    // 点击头部
    clickTitle (item) {
      if (item.active) {
        // 当前已经打开
        if (item.children.length === 0 && item.icon === false) {
          // 点击标题
          return
        }
        item.active = false
        this.$emit('update:MenuList', this.secondMenuList)
        return
      }
      else {
        // 未打开
        if (item.children.length === 0 && item.icon === false) {
          console.log(item);
          this.commonAction(item)
          this.$router.push(item.path)
          item.active = true
          this.$emit('update:MenuList', this.secondMenuList)
        }else{
        item.active = true
        this.$emit('update:MenuList', this.secondMenuList)
        }
      }
    },

    // 控制当前样式变化
    clickSub (father, son) {
      console.log(son);
      // 1. 激活父元素，激活子元素
      this.commonAction(father)
      father.children.forEach(ele => {
        ele.active = false
      })
      son.active = true
      this.$emit('update:MenuList', this.secondMenuList)
      this.$router.push(son.path)
    },
  },
  components: {
    ToolTip
  }
}
</script>

<style scoped lang="less">
.secondMenuSub {
  color: rgba(255, 255, 255, 0.5);
  .secondMenuHeader {
    display: flex;
    background-color: #343438;
    padding: 5px 2px;
    border-radius: 2px;
    font-size: 13px;
    box-sizing: border-box;
    transition: all 0.3s;
    cursor: pointer;
    margin-bottom: 12px;
    .fontSet {
      font-size: 8px;
      transition: all 0.3s;
      margin-right: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .fontSet.none {
      font-size: 8px;
      color: transparent;
    }
  }
  .secondMenuHeader.active {
    .fontSet {
      transform: rotate(90deg);
    }
  }
  .secondMenuContent {
    background-color: transparent;
    padding: 5px 2px;
    border-radius: 2px;
    font-size: 13px;
    box-sizing: border-box;
    cursor: pointer;
    margin-bottom: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    .fontSet {
      font-size: 8px;
      color: transparent;
      margin-right: 5px;
    }
  }
  .secondMenuContent.active {
    .className {
    }
  }
}
</style>
