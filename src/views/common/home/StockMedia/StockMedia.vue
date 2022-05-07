<template>
  <div>
    <div class="centerBodyStrock">
      <!-- 二级按钮 -->
      <div class="leftMenuStrock">
        <Menu :MenuList.sync="MenuList"></Menu>
      </div>
      <div class="rightContentStrock">
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from './components/menu.vue'

export default {
  data () {
    return {
      MenuList: [
        {
          active: true,
          className: "Downloaded",
          key: "Downloaded",
          icon: false,
          children: [
          ],
          path: '/home/Downloaded'
        },
        {
          active: false,
          className: "Stock Media",
          key: "Stock Media",
          icon: true,
          children: [
            { id: '1', className: "Clips", active: false, path: "/home/Clips" },
            { id: '2', className: "Videos", active: false, path: "/home/videos" },
            { id: '3', className: "Photos", active: false, path: "/home/photos" },
            { id: '4', className: "Gifs", active: false, path: "/home/Gifs" },
            { id: '5', className: "Stickers", active: false, path: "/home/Stickers" },
          ],
          path: '/home/Clips'
        }
      ]
    }
  },
  watch: {
    '$route.path':{
      handler:'changeMenu',
      immediate:true
    }
  },
  methods: {
    changeMenu () {
      if (this.$route.path === '/home/Downloaded') {
        this.MenuList.forEach(ele => {
          if (ele.path === '/home/Downloaded') {
            ele.active = true
          } else {
            ele.active = false
            ele.children.forEach(ele1 => {
              ele1.active = false
            })
          }
        })
        return
      }
      if (this.$route.path.includes('/home')) {
        this.MenuList.forEach(ele => {
          if (ele.key === 'Stock Media') {
            ele.active = true
            ele.children.forEach(ele1 => {
              if (ele1.path === this.$route.path) {
                ele1.active = true
              } else {
                ele1.active = false
              }
            })
          } else {
            ele.active = false
          }
          console.log();
        })
      }
    }
  },
  components: {
    Menu
  }
}
</script>

<style scoped lang="less">
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
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

.centerBodyStrock {
  display: flex;
  width: 100%;
  height: calc(100vh - 61px);
  position: relative;
  .leftMenuStrock {
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
  .rightContentStrock {
    flex: 1;
    height: 100%;
    overflow-y: overlay;
    box-sizing: border-box;
    padding: 10px 10px 10px 10px;
  }
}
</style>
