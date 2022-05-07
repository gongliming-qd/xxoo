<template>
  <div ref="contentBox">
    <slot
      v-if="needHeaderInsert"
      name="headerInsert"
    ></slot>
    <div
      class="subItem"
      v-for="(item, fatherIndex) in commonData.children"
      :key="item.id"
      :ref="`commonData-${item.id}`"
    >
      <div
        v-if="item.className === Collection && (commonData.collect||false) "
        class="subTitle"
      >
        {{`${item.className}(${item.children.length})`}}
      </div>
      <div
        v-else
        class="subTitle"
      >
        {{item.className}}
      </div>
      <div class="subContend">
        <div
          v-for=" (ele, sonIndex) in  item.children"
          :key="`${ele.id}-${ele.className}`"
          class="singleList"
        >
          <slot
            name="singleItem"
            :item="{son:ele, sonIndex, fatherIndex, gFather:commonData}"
          ></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Common', // 组件的name属性（后面有提到这里有个坑）
  data () {
    return {
      ArrOffsetTop: [], // 所有内容的offersetTop
      nowIndex: 0, // 自定义滚动到哪个地方了
      nowIsClickScroll: false // 控制当前是否是点击菜单而滚动
    }
  },
  watch: {
    // 'commonData.id': 'scrollListen',
    'updateIndex': {
      handler: 'scrollListen',
      deep: true,
      immediate: true
    }
  },
  mounted () {
    // this.scrollListen()
    // 超级深度监听
    // this.deepWatchCollection()
    window.onresize = () => {
      this.scrollListen()
    }
  },
  methods: {
    scrollItem (item, nowSubIndex) {
      this.nowIsClickScroll = true

      if (nowSubIndex === 'first') {
        $(this.$refs.contentBox.parentElement).animate({ scrollTop: 0 }, 400, 'swing', () => {
          this.$emit('scrollSetMenu', this.commonData, this.commonData.children[0])
          this.nowIsClickScroll = false
        });
        return
      }
      // 控制当前是点击菜单而滚动，避免执行自定义scroll的事件
      // 开始滚动
      $(this.$refs.contentBox.parentElement).animate({ scrollTop: this.$refs[`commonData-${item.id}`][0].offsetTop + 'px' }, 400, 'swing', () => {
        this.$emit('scrollSetMenu', this.commonData, this.commonData.children[nowSubIndex])
        this.nowIsClickScroll = false
      });
    },

    async scrollListen () {
      if (this.commonData === {}) {
        return
      }
      await this.countOfferSet()

      // 增加滚动事件
      $(this.$refs.contentBox.parentElement)[0].addEventListener('scroll', (e) => {
        let scrollTop = $(this.$refs.contentBox.parentElement)[0].scrollTop
        let nowIndex = 0

        // 计算当前scrollTop滚动到对应哪里的内容
        this.ArrOffsetTop.some((ele, index) => {
          if (ele > scrollTop - 14) {
            nowIndex = index
            return true
          }
        })
        if (this.ArrOffsetTop[this.ArrOffsetTop.length - 1] < scrollTop) {
          nowIndex = this.ArrOffsetTop.length - 1
        }
        this.nowIndex = nowIndex
        // 如果是点击菜单则不执行下面设置菜单操作
        if (this.nowIsClickScroll) {
          return
        } else {
          this.$emit('scrollSetMenu', this.commonData, this.commonData.children[nowIndex])
          // 控制左侧菜单变化到对应位置
          this.$emit('MenuScrollAnimate', nowIndex)
        }

      })

    },
    // 重置当前计算的高度集合ArrOffsetTop
    countOfferSet () {
      this.$nextTick(() => {
        // 获取所有的offsetTop
        this.ArrOffsetTop = []
        if (!this.commonData.children) return
        this.commonData.children.forEach(item => {
          this.ArrOffsetTop.push(this.$refs[`commonData-${item.id}`][0].offsetTop)
        })
        console.log(this.ArrOffsetTop)
      })
    },
    // 超级深度监听收藏行
    deepWatchCollection () {
      this.$watch(
        function () { // 第一个函数就是处理你要监听的属性，只要将其return出去就行
          return this.commonData.children[0].children
        },
        function (old, valold) {
          this.countOfferSet()
        }
      )
    }
  },
  props: {
    commonData: {
      type: Object,
      default: () => {
        return {
          needHeaderInsert: false
        }
      }
    },
    needHeaderInsert: {
      type: Boolean,
      default: false
    },
    Collection: {
      type: String
    },
    updateIndex: {
      type: Number
    }
  },
  components: {

  }
}
</script>

<style scoped lang="less">
.subItem {
  margin-bottom: 20px;
  .subTitle {
    font-size: 13px;
    color: rgba(255, 255, 255, 1);
    margin-bottom: 15px;
  }
  .subContend {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
    grid-template-rows: auto;
    grid-row-gap: 12px;
    grid-column-gap: 6px;
    margin-bottom: 12px;
    .singleList {
      // width: 100px;
      // height: 100px;
      // border-radius: 5px;
      // background-color: red;
    }
  }
}
</style>
