<template>
  <div
    class="tabs topNavSet"
    id="topNavSet"
  >
    <ul id="topNavSetUl">
      <li
        v-for=" (item, index) in list "
        :key="item.id"
        @click="clickSingle(item, index, $event)"
        class="single singleMenu"
        :class={active:item.active}
      > 
        <span class="subText">{{ item.id}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    list: {
      type: Array
    }
  },
  methods: {
    clickSingle (item, index, event) {
      this.goCenter(index, event)

      this.$emit('change', item)
    },
    goCenter (index, e) {
      console.log(index);
      let destination = index - 2;
      destination = destination < 0 ? 1 : destination;
     
      // 横向滑动居中
      let ul = document.querySelector('#topNavSetUl');
      let nav = document.getElementById("topNavSet");
      let window_offsetWidth = this.$el.offsetWidth; //屏幕宽度; 
      // let window_offsetWidth = window.innerWidth; //屏幕宽度; 
      
      let dom = e.target;
      if (dom) {
        let domoffsetWidth = dom.offsetLeft,
          //中间值 =( 屏幕宽度 - li宽度 ) / 2;
          diffWidth = (window_offsetWidth - dom.offsetWidth) / 2,
          //目标值 = offset - 中间值
          targetOffset = -(domoffsetWidth - diffWidth);
        let ul_width = ul.getBoundingClientRect().width;//开始

        // 未超出中间值
        if (-targetOffset < 0) {
          // nav.scrollLeft = 0;
          $(nav).animate({ scrollLeft: 0 }, 400, 'swing');
          console.log(11111111);
          return;
        }
        //末尾
        if (targetOffset < window_offsetWidth - ul_width) {
          $(nav).animate({ scrollLeft: -(window_offsetWidth - ul_width) }, 400, 'swing');
          // nav.scrollLeft = -(window_offsetWidth - ul_width);
          console.log(22222);
         return;
        }
        //正常
        // nav.scrollLeft = -targetOffset
         
          console.log(333333);

        $(nav).animate({ scrollLeft: -targetOffset }, 400, 'swing');

      }
    },
  },
  components: {

  }
}
</script>

<style scoped lang="less">
.topNavSet {
  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background-color: #29292d !important;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px #29292d !important;
    -webkit-box-shadow: inset 0 0 6px #29292d !important;
    border-radius: 10px !important;
    background-color: #29292d !important;
  }

  /*定义滑块 内阴影+圆角*/
  &::-webkit-scrollbar-thumb {
    border-radius: 10px !important;
    box-shadow: inset 0 0 6px #29292d !important;
    -webkit-box-shadow: inset 0 0 6px #29292d !important;
    background-color: #29292d !important;
  }

  height: 40px;
  background: #232228;
  display: flex;
  overflow-x: overlay;
  box-sizing: border-box;
  ul {
    display: inline-block;
    white-space: nowrap;
    display: flex;
    align-items: center;
    li {
      color: rgba(255, 255, 255, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: rgba(255, 255, 255, 0.5);
      margin-right: 24px;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 13px;
      &:first-child {
        margin-left: 1px;
      }
      &:last-child {
        margin-right: 24px;
      }
      &.active {
        position: relative;
        color: #8372ff;
        &:after {
          content: "";
          height: 2px;
          width: 100%;
          border-radius: 10px;
          background-color: #8372ff;
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style>
