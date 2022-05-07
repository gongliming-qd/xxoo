<template>
  <div class="tabs">
    <div
      v-for=" item in list "
      :key="item.id"
      @click="clickSingle(item)"
      class="single"
      :class={active:item.active}
    >
      {{item.id}}
    </div>
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
    clickSingle(item){
      this.$emit('change', item)
    }
  },
  components: {

  }
}
</script>

<style scoped lang="less">
.tabs {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .single{
    margin-right: 15px;
    color: white;
    cursor: pointer;
    font-size: 14px;
  }
  .single.active{
    color: @primaryColor;
  }
}
</style>
