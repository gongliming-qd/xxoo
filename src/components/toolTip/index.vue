<template>
  <el-tooltip
    :content="content"
    :placement="placement"
    effect="dark"
    :disabled="isDisabled"
  >
    <div
      class="contentnowrap"
      :class="{isLink: 'link-text'}"
      @mouseenter="isShowTooltip"
      @click="linkTo"
    >{{content}}</div>
  </el-tooltip>
</template>
 
<script>
export default {
  name: 'ShowTooltips',
  props: {
    content: {
      type: String,
      default: ''
    },
    isLink: {
      type: Boolean,
      default: false,
      required: false
    },
    placement: {
      type: String,
      default: 'bottom-end'
    }
  },
  data () {
    return {
      isDisabled: false
    }
  },
  methods: {
    isShowTooltip (e) {
      let clientWidth = e.target.clientWidth,
        scrollWidth = e.target.scrollWidth,
        arrList = Array.from(e.target.classList)
      if (scrollWidth > clientWidth) {
        this.isDisabled = false
        if (!arrList.includes('hover-blue')) {
          e.target.classList.add('hover-blue')
        }
      } else {
        this.isDisabled = true
        e.target.classList.remove('hover-blue')
      }
    },
    linkTo () {
      if (this.isLink) {
        this.$emit("linkTo")
      }
    }
  }
}
</script>
 
<style lang="less">
.contentnowrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hover-blue:hover {
  // color: red;
}
.link-text {
  // color: red;
  cursor: pointer;
}
.el-tooltip__popper {
  padding: 4px 7px !important;
  line-height: 16px;
}

 .el-tooltip__popper.is-dark {
  background: #2e2f30 !important;
  border: 1px solid #5b5b5b;
  box-shadow: 0px 2px 8px rgb(0 0 0 / 40%);
  border-radius: 1px;
  color: #ffffff;
  font-family: "Helvetica Neue";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  .popper__arrow{
   display: none;
  }
}

</style>

