<template>
  <div
    class="loadingFix"
    v-if="show"
    :style="{backgroundColor:backgroundColor}"
  >
    <img
      src="../../assets/gif/loading.gif"
      alt=""
    >
    <div class="intro">
      {{content}}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {

  },
  props: {
    content: {
      type: String
    },
    backgroundColor: {
      type: String
    },
    show: {
      type: Boolean
    }
  },
  components: {

  }
}
</script>

<style scoped lang="less">
.loadingFix {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 999999999999999999999999999999999999999999;
  > img {
    width: 32px;
    height: 32px;
  }
  .intro {
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    color: #ffffff;
    line-height: 20px;
    margin-top: 7px;
  }
}
</style>
