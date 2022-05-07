<template>
  <div>
    <div style="marginBottom:30px">
      <el-input
        style="width:250px"
        placeholder="请输入内容"
        v-model="inputgif"
        class="input-with-select"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="gifsSearchBtn"
        >gif搜索</el-button>
      </el-input>
      <el-button
        type="success"
        @click="giftrend"
      >gif热门</el-button>

    </div>
    <div style="marginBottom:30px">
      <el-input
        placeholder="请输入内容"
        v-model="inputsticker"
        class="input-with-select"
        style="width:250px"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="stickersSearchBtn"
        >sticker搜索</el-button>
      </el-input>
      <el-button
        type="danger"
        @click="stickertrend"
      >sticker热门</el-button>

    </div>
    <div style="marginBottom:30px">
      <el-input
        placeholder="请输入内容"
        v-model="inputimg"
        class="input-with-select"
        style="width:250px"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="imgsSearchBtn"
        >img搜索</el-button>
      </el-input>
      <el-button
        type="danger"
        @click="imgphotosTrending"
      >img热门</el-button>

    </div>
    <div style="marginBottom:30px">
      <el-input
        placeholder="请输入内容"
        v-model="inputvideo"
        class="input-with-select"
        style="width:250px"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="videosSearchBtn"
        >video搜索</el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
import { videosSearch, stickersSearch, stickersTrending, gifsTrending, gifsSearch, photosTrending, photosSearch } from '@/api/other'

export default {
  data () {
    return {
      inputgif: '',
      inputsticker: '',
      inputimg: "",
      inputvideo: ''
    }
  },
  methods: {
    async stickersSearchBtn () {
      console.log(111111111);
      let res = await stickersSearch({
        api_key: 'MEMHZYMarvIsyRoBqQvInPMTLEgKG9GF',
        limit: 32,
        offset: 1,
        q: this.inputsticker,
        lang: 'en'
      })
      console.log(res);
    },
    async stickertrend () {
      let res = await stickersTrending({
        api_key: 'MEMHZYMarvIsyRoBqQvInPMTLEgKG9GF',
        limit: 32,
        offset: 1,
        lang: 'en'
      })
      console.log(res);
    },
    async giftrend () {
      let res = await gifsTrending({
        api_key: 'MEMHZYMarvIsyRoBqQvInPMTLEgKG9GF',
        limit: 32,
        offset: 1,
        lang: 'en'
      })
      console.log(res);
    },
    async gifsSearchBtn () {
      let res = await gifsSearch({
        api_key: 'MEMHZYMarvIsyRoBqQvInPMTLEgKG9GF',
        limit: 32,
        offset: 1,
        q: this.inputsticker,
        lang: 'en'
      })
      console.log(res);
    },
    async imgphotosTrending () {
      let res = await photosTrending({
        client_id: 'cOi-jh7ey15F8fOMK_Fbb_CoDIcWTBjBicjQ2JRODiY',
        page: 1,
        per_page: 20,
        lang: 'en'
      })
      console.log(res);
    },
    async imgsSearchBtn () {
      let res = await photosSearch({
        client_id: 'cOi-jh7ey15F8fOMK_Fbb_CoDIcWTBjBicjQ2JRODiY',
        page: 1,
        per_page: 20,
        query: this.inputimg,
      })
      console.log(res);
    },
    async videosSearchBtn () {
      let res = await videosSearch({
        key: '26745843-4d6979c26b1803727b43e46df',
        page: 1,
        per_page: 20,
        q: this.inputvideo,
      })
      console.log(res);
    },
  },
  components: {

  }
}
</script>

<style scoped lang="less">
</style>
