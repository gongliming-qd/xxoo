<template>
  <div class="home">
    <Loading :show="$store.state.loading"></Loading>
    <div class="topSelect">
      <div
        class="topNav"
        id="topNav"
        ref="topNav"
      >
        <ul
          id="topNavUl"
          class="topNavUl"
        >
          <li
            v-for="(item,index) in DataList"
            :key="item[0].id"
            class="singleMenu"
            :class="{active:item[0].selectActive}"
            @click="subMenuChange(item, index, $event)"
          >
            <div class="bottomimg">
              <img
                :src="item[0].selectActive? item[0].iconSelect:item[0].iconDefault"
                alt=""
              >
            </div>
            <div class="subText">
              <Tool-tip
                :content="item[0].className"
                placement="bottom-start"
              ></Tool-tip>
            </div>
          </li>
        </ul>

      </div>
      <div
        class="turnLeftIcon"
        v-if="topNavStatus === '2'"
        @click="turnToLeft"
      >
        <img
          src="@/assets/img/topTurn/turnLeft.svg"
          alt=""
        >
      </div>
      <div
        class="turnRightIcon"
        v-if="topNavStatus === '3'"
        @click="turnToRight"
      >
        <img
          src="@/assets/img/topTurn/turnRight.svg"
          alt=""
        >
      </div>
    </div>
    <div class="topContend">
      <MusicsSection
        v-show="useCommon === 'Musics'"
        :MenuData="MenuData"
        :DataList.sync="DataList"
        :updateIndex.sync="updateIndex"
        subSingleTitle
      />
      <RoutineSection
        v-show="useCommon === 'Common'"
        :MenuData="MenuData"
        :DataList.sync="DataList"
        :updateIndex.sync="updateIndex"
        @changeDataList="changeDataList"
        @saveAllData="saveAllData"
        :DataDownList.sync="DataDownList"
      />
      <RoutineSection
        v-show="useCommon === 'CommonTitle'"
        :MenuData="MenuData"
        :DataList.sync="DataList"
        :updateIndex.sync="updateIndex"
        subSingleTitle
        @changeDataList="changeDataList"
        @saveAllData="saveAllData"
        :DataDownList.sync="DataDownList"
      />
      <Materia v-show="useCommon === 'Materia'">
      </Materia>
      <StockMedia v-show="useCommon === 'StockMedia'"></StockMedia>

    </div>

  </div>
</template>

<script>
import _ from 'lodash'
import { getProductList } from "@/api/product"
import { convertImgToBase64, setlocalTime, getlocalTime, creactAjax } from "@/util/common"
// 导入组件
// 1. 左侧菜单
import lmMenuScroll from "../../../../packages/index"
import ToolTip from "@/components/toolTip/index.vue"
import Loading from "@/components/loading/index.vue"


import MusicsSection from "./Music/Music.vue"
import RoutineSection from "./Routine/Routine.vue"
import StockMedia from "./StockMedia/StockMedia.vue"
import Materia from "./Materia/Materia.vue"
// import lmMenuScroll from 'lm-menu-scroll'
// import 'lm-menu-scroll/dist/lm-menu-scroll.css'

export default {
  data () {
    return {
      updateIndex: 1,
      nowLanguage: 'cn',
      topNavStatus: "1",
      useCommon: false,
      MenuData: [{ id: '' }],
      DataList: [
        // Materia 0
        [
          {
            active: true,
            children: [],
            className: "Materia",
            collect: false,
            control: "Materia",
            icon: true,
            iconDefault: require('@/assets/img/topICon/materia_default.svg'),
            iconSelect: require('@/assets/img/topICon/materia_hover.svg'),
            id: "Materia",
            needHeaderInsert: false,
            selectActive: false,
            titleLocal: {
              key_name: true,
              translate: {
                cn: "素材库",
                ar: "المواد",
                de: "Mediathek",
                en: "Media",
                es: "Materiales",
                fr: "Matériel",
                in: "मीडिया",
                id: "Media",
                it: "Media",
                jp: "メディア",
                kr: "미디어 은행",
                nl: "Media",
                br: "Mídia",
                ru: "Материалы",
                tr: "Medya",
                tw: "素材庫",
                ru: "Материалы",
              }
            }
          }
        ],
        //  StockMedia 1
        [{
          active: true,
          children: [],
          className: "StockMedia",
          collect: false,
          control: "StockMedia",
          icon: true,
          iconDefault: require('@/assets/img/topICon/StockMedia_default.svg'),
          iconSelect: require('@/assets/img/topICon/StockMedia_hover.svg'),
          id: "StockMedia",
          needHeaderInsert: false,
          selectActive: false,
          titleLocal: {
            key_name: true,
            translate: {
              cn: "素材资源库",
              ar: "Stock Media",
              de: "Stock Media",
              en: "Stock Media",
              es: "Stock Media",
              fr: "Stock Media",
              in: "Stock Media",
              id: "Stock Media",
              it: "Stock Media",
              jp: "Stock Media",
              kr: "Stock Media",
              nl: "Stock Media",
              br: "Stock Media",
              ru: "Stock Media",
              tr: "Stock Media",
              tw: "Stock Media",
            }
          }
        }],
        // 元素 2
        [
          {
            active: true,
            category: Array(0),
            children: Array(1),
            className: "Element",
            collect: false,
            control: "CommonTitle",
            icon: true,
            iconDefault: require('@/assets/img/topICon/effects_default.svg'),
            iconSelect: require('@/assets/img/topICon/effects_hover.svg'),
            id: "1649492524krcnr",
            needHeaderInsert: false,
            s_id: "1649492524krcnr",
            selectActive: false,
            titleLocal: {
              key_name: true,
              translate: {
                cn: "元素",
                ar: "Element",
                de: "Element",
                en: "Element",
                es: "Element",
                fr: "Element",
                in: "Element",
                id: "Element",
                it: "Element",
                jp: "Element",
                kr: "Element",
                nl: "Element",
                br: "Element",
                ru: "Element",
                tr: "Element",
                tw: "Element",
              }
            }
          }
        ],
        // 音乐 3
        [
          {
            active: true,
            category: [],
            children: [],
            className: "Musics",
            collect: false,
            control: "Musics",
            icon: true,
            iconDefault: require('@/assets/img/topICon/audio_default.svg'),
            iconSelect: require('@/assets/img/topICon/audio_hover.svg'),
            id: "Musics",
            needHeaderInsert: false,
            s_id: "Musics",
            selectActive: false,
            titleLocal: {
              key_name: true,
              translate: {
                cn: "声音",
                ar: "صوت",
                de: "Ton",
                en: "Sound",
                es: "Sonido",
                fr: "Son",
                in: "साउंड",
                id: "Suara",
                it: "Suono",
                jp: "音声",
                kr: "소리",
                nl: "Geluid",
                br: "Som",
                ru: "Звук",
                tr: "Ses",
                tw: "聲音",
              }
            }
          }
        ],
        // text 4
        [
          {
            active: true,
            category: [],
            children: [],
            className: "Text",
            collect: false,
            control: "Common",
            icon: true,
            iconDefault: require('@/assets/img/topICon/text_default.svg'),
            iconSelect: require('@/assets/img/topICon/text_hover.svg'),
            id: "Texts",
            needHeaderInsert: false,
            s_id: "Texts",
            selectActive: true,
            titleLocal: {
              key_name: true,
              translate: {
                cn: "文字",
                ar: "نص",
                de: "Text",
                en: "Text",
                es: "Texto",
                fr: "Texte",
                in: "टेक्स्ट",
                id: "Teks",
                it: "Testo",
                jp: "テキスト",
                kr: "텍스트",
                nl: "Tekst",
                br: "Texto",
                ru: "Текст",
                tr: "Metin",
                tw: "文字",
              }
            }
          }
        ],
        // 贴纸 5
        [
          {
            active: true,
            category: [],
            children: [],
            className: "Strickets",
            collect: false,
            control: "Common",
            icon: true,
            iconDefault: require('@/assets/img/topICon/stickers_default.svg'),
            iconSelect: require('@/assets/img/topICon/stickers_hover.svg'),
            id: "贴纸（不要删除）1649399001cykpm",
            needHeaderInsert: false,
            s_id: "贴纸（不要删除）1649399001cykpm",
            selectActive: false,
            titleLocal: {
              key_name: true,
              translate: {
                cn: "贴纸",
                ar: "ملصقات",
                de: "Aufkleber",
                en: "Stickers",
                es: "Pegatinas",
                fr: "Autocollants",
                in: "स्टीकर",
                id: "Stiker",
                it: "Adesivi",
                jp: "ステッカー",
                kr: "스티커",
                nl: "Stickers",
                br: "Adesivos",
                ru: "Наклейки",
                tr: "Etiketler",
                tw: "貼紙",
              }
            }
          }
        ],
        // 转场 6
        [
          {
            active: true,
            category: [],
            children: [],
            className: "Transitions",
            collect: false,
            control: "CommonTitle",
            icon: true,
            iconDefault: require('@/assets/img/topICon/transition_default.svg'),
            iconSelect: require('@/assets/img/topICon/transition_hover.svg'),
            id: "Transitions",
            needHeaderInsert: false,
            s_id: "Transitions",
            selectActive: false,
            titleLocal: {
              key_name: true,
              translate: {
                cn: "转场",
                ar: "انتقال",
                de: "Überleitung",
                en: "Transition",
                es: "Transición",
                fr: "Transition",
                in: "ट्रांजीशन",
                id: "Transisi",
                it: "Transizione",
                jp: "切り替え",
                kr: "화면전환",
                nl: "Overgang",
                br: "Transição",
                ru: "Переход",
                tr: "Geçiş",
                tw: "轉場",
              }
            }
          }
        ],
        // 滤镜 7 
        [
          {
            active: true,
            category: [],
            children: [],
            className: "VideoFilters",
            collect: false,
            control: "CommonTitle",
            icon: true,
            iconDefault: require('@/assets/img/topICon/filter_default.svg'),
            iconSelect: require('@/assets/img/topICon/filter_hover.svg'),
            id: "VideoFilters",
            needHeaderInsert: false,
            s_id: "VideoFilters",
            selectActive: false,
            titleLocal: {
              key_name: true,
              translate: {
                cn: "滤镜",
                ar: "تصفية",
                de: "Filter",
                en: "Filters",
                es: "Filtros",
                fr: "Filtres",
                in: "फ़िल्टर",
                id: "Filter",
                it: "Filtri",
                jp: "フィルター",
                kr: "필터",
                nl: "Filters",
                br: "Filtros",
                ru: "Фильтры",
                tr: "Filtreler",
                tw: "濾鏡",
              }
            }
          }
        ],
        // 特效 8
        [
          {
            active: true,
            category: [],
            children: [],
            className: "Effects",
            collect: false,
            control: "CommonTitle",
            icon: true,
            iconDefault: require('@/assets/img/topICon/element_default.svg'),
            iconSelect: require('@/assets/img/topICon/element_hover.svg'),
            id: "1649492472d4g0d",
            needHeaderInsert: false,
            s_id: "1649492472d4g0d",
            selectActive: false,
            titleLocal: {
              key_name: true,
              translate: {
                cn: "特效",
                ar: "Effect",
                de: "Effect",
                en: "Effect",
                es: "Effect",
                fr: "Effect",
                in: "Effect",
                id: "Effect",
                it: "Effect",
                jp: "Effect",
                kr: "Effect",
                nl: "Effect",
                br: "Effect",
                ru: "Effect",
                tr: "Effect",
                tw: "Effect",
              }
            }
          }
        ]
      ],
      DataDownList: [],
      allCompareArr: [],
      websocket: {
        wsUrl: 'ws://localhost:8080',
        websocket: null
      },
      currentTopNav: "0",
      vuexData: {}
    }
  },
  computed: {
    topIConShow () {
      return 1
    }
  },
  created () {
    this.initWebSocket()
  },
  mounted () {
    window.onresize = this.countShow
  },

  methods: {
    async _initGetData () {
      this.$store.dispatch('setLoading', true)
      // this.DataList = []
      try {
        let res = await getProductList({
          env: 'test',
          pro_id: '1',
          version: '2',
        })
        if (res.status === 200) {
          // 缓存24小时时间
          setlocalTime()
          // 处理顶部多语言
          // 元素
          for (let i in res.data.data) {

            if (i === 'effect270') {
              this.DataList[2] = [{ ...this.DataList[2][0], ..._.cloneDeep(res.data.data[i]) }]
            }
          }
          // 音乐
          for (let i in res.data.data) {
            if (i === 'effect1') {
              this.DataList[3] = [{ ...this.DataList[3][0], ..._.cloneDeep(res.data.data[i]) }]
            }
          }
          // text
          for (let i in res.data.data) {
            if (i === 'effect3') {
              this.DataList[4] = [{ ...this.DataList[4][0], ..._.cloneDeep(res.data.data[i]) }]
            }
          }
          // 贴纸
          for (let i in res.data.data) {
            if (i === 'effect268') {
              this.DataList[5] = [{ ...this.DataList[5][0], ..._.cloneDeep(res.data.data[i]) }]
            }
          }
          // 转场
          for (let i in res.data.data) {
            if (i === 'effect4') {
              this.DataList[6] = [{ ...this.DataList[6][0], ..._.cloneDeep(res.data.data[i]) }]
            }
          }
          // 滤镜
          for (let i in res.data.data) {
            if (i === 'effect5') {
              this.DataList[7] = [{ ...this.DataList[7][0], ..._.cloneDeep(res.data.data[i]) }]
            }
          }
          // 特效
          for (let i in res.data.data) {
            if (i === 'effect269') {
              this.DataList[8] = [{ ...this.DataList[8][0], ..._.cloneDeep(res.data.data[i]) }]
              // this.DataList.push([{ ..._.cloneDeep(res.data.data[i]), control: 'CommonTitle' }])
            }
          }

          // 处理子元素
          await this.doTransformation()
          // 默认显示第一个
          this.subMenuChangeInit(this.DataList[0])

          console.log(this.websocket.readyState);
          this.$store.state.websocket.send(JSON.stringify({
            path: '/setStorage',
            type: 'materialBackgroundAllList',
            data: this.DataList,
          }))
          this.$store.state.websocket.onmessage = (evt) => {
            let obj = JSON.parse(evt.data)
            if (obj.path === '/setStorage' && obj.result.type === 'materialBackgroundAllList') {
              if (obj.result.code === 200 && obj.result.status) {
                // console.log('存储成功~');
              }
            }
          }

          setInterval(() => {
            this.saveAllData()
          }, 5000)

          this.$nextTick(() => {
            this.updateIndex++

            // 顶部是否需要滚动条
            this.countShow()
            this.$store.dispatch('setLoading', false)
          })
        }
      } finally {
        this.$store.dispatch('setLoading', false)
      }

    },
    // 改变总体数据中某个变量
    changeDataList (arr) {
      let [index1, index2, index3, index4] = arr
      this.DataList[index1][index2].children[index3].children[index4].downLoad = true
    },
    // 改变已下载数据
    changeReadyDownloadList (arr) {
      this.DataDownList = arr
    },
    // 修改所有数据的多语言
    changeNowLanguageShow (lang) {
      this.DataList.forEach(item1 => {
        item1.forEach(item2 => {
          if (item2.title.key_name) {
            item2.className = item2.title.translate[lang]
          } else {
            item2.className = item2.s_id
          }
          item2.children.forEach(item3 => {
            if (item3.title.key_name) {
              item3.className = item3.title.translate[lang]
            } else {
              item3.className = item3.s_id
            }
            item3.children.forEach(item4 => {
              if (item4.title.key_name) {
                item4.className = item4.title.translate[lang]
              } else {
                item4.className = item4.s_id
              }
            })
          })
        })
      })
      this.$nextTick(() => {
        this.updateIndex++
        this.$store.dispatch('setUpdateIndex', this.updateIndex)
      })
    },
    // 接口保存全部
    saveAllData () {
      creactAjax({
        path: '/setStorage',
        type: 'materialBackgroundAllList',
        data: this.DataList,
      }, async (obj) => {
        if (obj.path === '/setStorage' && obj.result.type === 'materialBackgroundAllList') {
          if (obj.result.code === 200 && obj.result.status) {
            // console.log('存储成功');
          }
        }
      })
    },
    // 获取当前已下载数据
    getNowDownloadList () {
      this.storageData({ path: '/getStorage', type: 'materialBackgroundDownloadList' })
    },
    // 设置当前已下载数据
    setNowDownloadList (data) {
      this.storageData({
        path: '/setStorage',
        type: 'materialBackgroundDownloadList',
        data
      })
    },
    // 处理子元素
    doTransformation () {
      console.log(this.DataList);
      let subDataownList = this.DataDownList.map(ele => {
        return ele.s_id
      })
      console.log(subDataownList);
      // 1. 处理子元素数据结构
      this.DataList.forEach((item1, index1) => {
        console.log(item1[0].id);
        if (item1[0].id === 'Materia' || item1[0].id === 'StockMedia') {
          console.log(item1);
          item1[0].className = item1[0].titleLocal.translate[this.nowLanguage]
          return
        }
        item1.forEach((item2, index2) => {
          item2.id = item2.s_id
          if (item2.titleLocal.key_name) {
            item2.className = item2.titleLocal.translate[this.nowLanguage]
          } else {
            item2.className = item2.s_id
          }
          item2.collect = false
          item2.needHeaderInsert = false
          item2.icon = true
          item2.active = true
          item2.children = []
          item2.children = [...item2.category]
          item2.category = []
          item2.children.forEach((item3, index3) => {
            this.$set(item3, 'id', item3.s_id)
            if (item3.title.key_name) {
              this.$set(item3, 'className', item3.title.translate[this.nowLanguage])
            } else {
              this.$set(item3, 'className', item3.s_id)
            }
            this.$set(item3, 'active', false)
            this.$set(item3, 'children', [])
            item3.children = [...item3.detail]
            item3.detail = []
            item3.children.forEach((item4, index4) => {

              this.$set(item4, 'id', item4.s_id)
              if (item4.title.key_name) {
                this.$set(item4, 'className', item4.title.translate[this.nowLanguage])
              } else {
                this.$set(item4, 'className', item4.s_id)
              }
              this.$set(item4, 'collect', false)
              this.$set(item4, 'downLoad', false)
              this.$set(item4, 'active', false)
              this.$set(item4, 'preview_url_show', '')
              this.$set(item4, 'adressArr', [
                index1, index2, index3, index4
              ])
              // 处理24小时数据缓存
              this.allCompareArr.forEach(ele => {
                if (ele.s_id === item4.s_id) {
                  // 判断文件是否已经下载，已下载的话downLoad
                  if (ele.file_url === item4.file_url && subDataownList.includes(ele.s_id) && ele.downLoad) {
                    this.$set(item4, 'downLoad', true)
                  }
                  // 处理预览图缓存
                  if (ele.preview_url === item4.preview_url && ele.preview_url_show) {
                    this.$set(item4, 'preview_url_show', ele.preview_url_show)
                  }
                }
              })
              if (!item4.preview_url_show) {
                // 保存文件预览图
                convertImgToBase64(item4.preview_url, (base64Img) => {
                  this.storageData({
                    path: '/downloadPreviewImg',
                    data: {
                      s_id: item4.s_id,
                      base64Img: base64Img,
                      siteAdress: 'hitpaw',
                      adressArr: [
                        index1, index2, index3, index4
                      ]
                    },
                  })
                })
              }

            })

          })
        })

      })
    },
    // 第二次加载preview_url没下载好的重新下载
    secondDoTransformation () {
      console.log(this.DataList);
      // 1. 处理子元素数据结构
      this.DataList.forEach((item1, index1) => {
        if (item1[0].id === 'Materia') return
        if (item1[0].id === 'StockMedia') return
        item1.forEach((item2, index2) => {
          item2.children.forEach((item3, index3) => {
            item3.children.forEach((item4, index4) => {
              console.log(item4.preview_url_show);
              if (item4.preview_url_show.length === 0) {
                convertImgToBase64(item4.preview_url, (base64Img) => {
                  this.storageData({
                    path: '/downloadPreviewImg',
                    data: {
                      s_id: item4.s_id,
                      base64Img: base64Img,
                      siteAdress: 'hitpaw',
                      adressArr: [
                        index1, index2, index3, index4
                      ]
                    },
                  })
                })
              }
            })
          })
        })

      })
    },
    // 点击一级菜单，滚动
    subMenuChange (item, index, event) {


      this.goCenter(index, event)
      console.log(item);
      // 1. 控制当前选用哪个组件
      this.useCommon = item[0].control
      console.log(this.useCommon);
      // 2. 控制顶部选项卡切换样式
      this.DataList.forEach(ele => {
        ele.forEach(ele1 => {
          ele1.selectActive = false
        })
      })
      item[0].selectActive = true
      // 3.清空需要滚动的组件的默认选中样式
      this.DataList.forEach(ele => {
        if (ele[0].id !== "Materia") {
          ele[0].children.forEach(ele1 => {
            ele1.children.forEach(ele2 => {
              ele2.active = false
            })
          })
        }
      })
      // 通知切换了菜单
      if (item[0].control === 'Materia') {
        this.storageData({
          path: '/views/tabsSwitch',
          data: {
            status: true
          }
        })
      } else {
        this.storageData({
          path: '/views/tabsSwitch',
          data: {
            status: false
          }
        })
      }
      // 4. 如果是自定义组件则不需要重新加载数据了
      if (item[0].control === 'Materia' || item[0].control === 'StockMedia') {
        if (item[0].control === 'StockMedia') {
          this.$store.dispatch('setUpdateIndex', this.$store.state.updateIndex + 1)

        } else {

        }
        return
      }

      // 5. 滚动的组件数据渲染
      this.MenuData = _.cloneDeep(item)
      console.log(this.MenuData);
      this.$nextTick(() => {
        this.updateIndex++
        this.$store.dispatch('setUpdateIndex', this.updateIndex)
      })
    },
    // 初始化的时候点击第一个
    subMenuChangeInit (item) {
      this.storageData({
        path: '/views/tabsSwitch',
        data: {
          status: true
        }
      })
      console.log(item);
      // 1. 控制当前选用哪个组件
      this.useCommon = item[0].control
      // 2. 控制顶部选项卡切换样式
      this.DataList.forEach(ele => {
        ele.forEach(ele1 => {
          ele1.selectActive = false
        })
      })
      item[0].selectActive = true
      // 3.清空需要滚动的组件的默认选中样式
      this.DataList.forEach(ele => {
        if (ele[0].id !== "Materia") {
          ele[0].children.forEach(ele1 => {
            ele1.children.forEach(ele2 => {
              ele2.active = false
            })
          })
        }
      })
      // 4. 如果是自定义组件则不需要重新加载数据了
      if (item[0].control === 'Materia' || item[0].control === 'StockMedia') {
        return
      }
      // 5. 滚动的组件数据渲染
      this.MenuData = _.cloneDeep(item)
      console.log(this.MenuData);
      this.$nextTick(() => {
        this.updateIndex++
        this.$store.dispatch('setUpdateIndex', this.updateIndex)
      })
    },

    // websocket 部分 --
    initWebSocket () {
      try {
        if (this.websocket.websocket && this.websocket.readyState == 1) {
          this.stopWebSocket()
        }
        this.websocket.websocket1 = new WebSocket(this.websocket.wsUrl);
        this.$store.dispatch('setWebsocket', this.websocket.websocket1)
        this.websocket.websocket2 = new WebSocket(this.websocket.wsUrl);
        this.websocket.websocket3 = new WebSocket(this.websocket.wsUrl);
        this.websocket.websocket = new WebSocket(this.websocket.wsUrl);
        this.$store.dispatch('setOnlyWebsocket', this.websocket.websocket)



        this.websocket.websocket.onopen = (evt) => {
          console.log('open');
          creactAjax({ path: '/views/getLanguage' }, (obj) => {
            if (obj.path === '/views/getLanguage') {
              this.nowLanguage = obj.result.data
              this.getNowDownloadList()
              this.storageData({ path: '/getStorage', type: 'materialBackgroundAllList' })
            }
          })
        };
        this.websocket.websocket.onclose = (evt) => {
          console.log('DISCONNECTED');
        };
        this.websocket.websocket.onmessage = (evt) => {
          let obj = JSON.parse(evt.data)
          // this.vuexData[obj.requestData.num] = obj
           if(obj.requestData.num){
             console.log(obj.requestData.num, obj);
            this.$store.state.onlywebsocketCallBackData[obj.requestData.num] = obj
             this.$store.state.proxy1[obj.requestData.num]['name'] = Math.random()
          }

          // this.$store.dispatch('setOnlywebsocketCallBackData', this.$store.state.onlywebsocketCallBackData )
          this.webSocketReceive(obj)

        };
        this.websocket.websocket.onerror = (evt) => {
          console.log(evt.data);
        };
      } catch (exception) {
        this._initGetData()
        alert(exception)
      }
    },
    stopWebSocket () {
      if (this.websocket.websocket) {
        this.websocket.websocket.close();
      }
    },

    storageData (data) {
      this.websocket.websocket.send(JSON.stringify(data))
    },
    async webSocketReceive (obj) {



      if (obj.path === '/getStorage' && obj.result.type === 'materialBackgroundAllList') {
        if (obj.result.code === 200 && obj.result.status) {
          // 第一次使用
          if (obj.result.data.length == 0) {
            this._initGetData()
          }
          // 第二次且超出一天
          else if (getlocalTime()) {
            // 超出1天缓存
            // 1. 整理所有数据为一排数组，用于遍历检索
            this.allCompareArr = []
            obj.result.data.forEach(item1 => {
              if (item1[0].id === 'Materia') return
              if (item1[0].id === 'StockMedia') return
              item1.forEach(item2 => {
                item2.children.forEach(item3 => {
                  item3.children.forEach(item4 => {
                    this.allCompareArr.push(item4)
                  })
                })
              })

            })
            console.log(this.allCompareArr);
            this._initGetData()

          }
          // 第二次且未超出时间
          else {
            this.DataList = obj.result.data
            await this.secondDoTransformation()
            await this.subMenuChangeInit(this.DataList[0])
            this.$nextTick(() => {
              this.updateIndex++
              this.$store.dispatch('setLoading', false)
              setInterval(() => {
                this.saveAllData()
              }, 5000)
            })
          }
        }
      }
      else if (obj.path === '/getStorage' && obj.result.type === 'materialBackgroundDownloadList') {
        if (obj.result.code === 200 && obj.result.status) {
          this.DataDownList = obj.result.data
          console.log(this.DataDownList);
        }
      }
      else if (obj.path === '/setStorage' && obj.result.type === 'materialBackgroundDownloadList') {
        if (obj.result.code === 200 && obj.result.status) {
          console.log('更新成功');
        }
      }
      else if (obj.path === '/views/tabsSwitch') {
        if (obj.result.code === 200 && obj.result.status) {
          console.log('切换成功');
        }
      }
      else if (obj.path === '/downloadPreviewImg' && obj.result.siteAdress === 'hitpaw') {
        if (obj.result.code === 200 && obj.result.status) {
          let [index1, index2, index3, index4] = obj.result.adressArr
          this.DataList[index1][index2].children[index3].children[index4].preview_url_show = obj.result.baseUrl
        }
      }
    },
    // 样式部分
    goCenter (index, e) {
      let destination = index - 2;
      destination = destination < 0 ? 1 : destination;
      if (this.navScroll) {
        this.navScroll.scrollToElement(
          document.querySelector('#topNav li:nth-child(' + destination + ')')
        );
      }
      // 横向滑动居中
      let ul = document.querySelector('#topNavUl');
      let nav = document.getElementById("topNav");
      let window_offsetWidth = window.innerWidth; //屏幕宽度;
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
          $(nav).animate({ scrollLeft: 0 }, 400, 'swing', () => {
            this.countShow()
          });

          return;
        }
        //末尾
        if (targetOffset < window_offsetWidth - ul_width) {
          $(nav).animate({ scrollLeft: -(window_offsetWidth - ul_width) }, 400, 'swing', () => {
            this.countShow()
          });
          // nav.scrollLeft = -(window_offsetWidth - ul_width);
          return;
        }
        //正常
        // nav.scrollLeft = -targetOffset
        $(nav).animate({ scrollLeft: -targetOffset }, 400, 'swing', () => {
          this.countShow()
        });

      }
    },
    // 顶部是否需要滚动条
    countShow () {
      let offerSetWidth = this.$el.offsetWidth
      let scrollLeftWidth = this.$refs.topNav.scrollLeft
      let scrollWidth = this.$refs.topNav.scrollWidth
      let canScrollWidth = scrollWidth - offerSetWidth

      console.log(offerSetWidth, scrollLeftWidth, scrollWidth);
      if (offerSetWidth >= scrollWidth) {
        this.topNavStatus = '1'
        return
      }
      else if (scrollLeftWidth < canScrollWidth / 2) {
        this.topNavStatus = '3'
        return
      }
      else if (scrollLeftWidth > canScrollWidth / 2) {
        this.topNavStatus = '2'
      }
    },
    turnToRight () {
      let nav = document.getElementById("topNav");
      let offerSetWidth = this.$el.offsetWidth
      let scrollWidth = this.$refs.topNav.scrollWidth
      let canScrollWidth = scrollWidth - offerSetWidth
      $(nav).animate({ scrollLeft: canScrollWidth }, 400, 'swing', () => {
        this.countShow()
      });
    },
    turnToLeft () {
      let nav = document.getElementById("topNav");
      $(nav).animate({ scrollLeft: 0 }, 400, 'swing', () => {
        this.countShow()
      });
    },

  },
  components: {
    lmMenuScroll, ToolTip, Loading, MusicsSection, RoutineSection, StockMedia, Materia
  }
}
</script>

<style scoped lang="less">
.home {
  position: relative;
  box-sizing: border-box;
  .topSelect {
    position: relative;
    box-sizing: border-box;
    .topNav {
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
      display: flex;
      align-items: center;
      height: 61px;
      background: #29292d;
      overflow-x: overlay;
      border-bottom: 1px solid #000;
      box-sizing: border-box;
      ul {
        display: inline-block;
        white-space: nowrap;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        li {
          width: 52px;
          color: rgba(255, 255, 255, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: rgba(255, 255, 255, 0.5);
          margin-right: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 13px;
          &:first-child {
            margin-left: 8px;
          }
          &:last-child {
            margin-right: 8px;
          }
          &.active {
            position: relative;
            color: #8372ff;
          }
          .bottomimg {
            display: flex;
            align-items: flex-end;
            justify-content: center;
          }
          .subText {
            max-width: 52px;
            font-size: 12px;
            line-height: 14px;
          }
        }
      }
    }
    .turnLeftIcon {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 32px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      background-color: #232228;
      cursor: pointer;
    }
    .turnRightIcon {
      position: absolute;
      right: 0px;
      top: 0px;
      width: 32px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background-color: #232228;
      cursor: pointer;
    }
  }

  .topContend {
    width: 100%;
    height: calc(100vh - 61px);
    background-color: #232228;
  }
}
</style>
