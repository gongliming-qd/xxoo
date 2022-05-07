<template>
  <div class="noneShow">
    <img
      src="./img/noneComponents.svg"
      alt=""
    >
    <div class="subTitle">
      Files downloaded from the <span class="link" @click="linkTo">stock media</span> will be displayed here
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
    linkTo(){
      this.$router.push('/home/Clips')
    }
  },
  components: {

  }
}
</script>

<style scoped lang="less">
.noneShow {
  width: 100%;
  height: 100%;
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
      cursor: pointer;
    }
  }
}
</style>
