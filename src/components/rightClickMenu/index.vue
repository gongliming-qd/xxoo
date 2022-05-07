<template>
  <div
    class="showRightMenu"
    ref="showRightMenu"
  >
    <div
      v-for="item in menuList"
      :key="item.key"
      class="common dele"
      @click="clickSingle(item)"
    > {{item.className}}</div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  data () {
    return {
      elDom:null
    }
  },
  methods: {
    changeCSS (prop) {
      $(this.$el).css({ ...prop })
    },
    close () {
      this.changeCSS({ 'z-index': -1 })
    },
    show (e) {
      let blockWidth = this.$el.offsetWidth
      let blockHeight = this.$el.offsetWidth

      let windowWidth = $(window).width()
      let windowHeight = $(window).height()

      let posLeft = 0
      let posTop = 0

      if (e.pageX + blockWidth - windowWidth < 0) {
        // 正常情况
        posLeft = e.pageX
      } else {
        posLeft = e.pageX - (e.pageX + blockWidth - windowWidth) - 8
      }
      if (e.pageY + blockHeight - windowHeight < 0) {
        // 正常情况
        posTop = e.pageY
      } else {
        posTop = e.pageY - (e.pageY + blockHeight - windowHeight) - 8
      }

      this.changeCSS({ 'z-index': 3, left: posLeft, top: posTop })
    },
    clickSingle (item) {
      this.$emit('change', item)
    },
    install (component, props) {
      //component 参数为组件名
      var instance = new Vue({
        el: document.createElement("div"),
        render: (createElement) => {
          return createElement(component, {
            ...props
          })
        },
      });
      this.elDom = instance.$el
      document.body.appendChild(this.elDom);
      return instance.$children[0]
    },
    unInstall(){
      document.body.removeChild(this.$el);
    }
  },
  props: {
    menuList: {
      type: Array
    }
  },
  mounted () {
    
    window.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.close()
      }
    })
    window.addEventListener('resize', () => {
      this.changeCSS({ 'z-index': -1 })
    })
  },
  components: {

  }
}
</script>

<style scoped lang="less">
.showRightMenu {
  padding: 10px 0;
  min-width: 108px;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  box-sizing: border-box;
  background: linear-gradient(0deg, #343438, #343438), #ffffff;
  border: 1px solid #505050;
  border-radius: 4px;
  .common {
    width: 100%;
    color: #fff;
    font-family: "Helvetica Neue";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    padding: 3px 19px;
    box-sizing: border-box;
    transition: all 0.3s;
    background-color: transparent;
    &:hover {
      background-color: #8372ff;
    }
  }
}
</style>
