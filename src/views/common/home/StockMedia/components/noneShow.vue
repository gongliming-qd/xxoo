<template>
  <div class="noneShow">
    <img
      src="./img/noneComponents.svg"
      alt=""
    >
    <div class="subTitle">
      No search results, try other keyword
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
  components: {

  }
}
</script>

<style scoped lang="less">
.noneShow {
  height: calc(100vh - 130px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
  .subTitle {
    font-family: "Helvetica Neue";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    .link {
      color: #8372ff;
    }
  }
}
</style>
