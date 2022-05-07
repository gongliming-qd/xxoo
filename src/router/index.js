/*
 * @Author: glm
 * @Date: 2022-02-09 19:52:59
 * @LastEditors: your Name
 * @LastEditTime: 2022-02-16 15:42:04
 * @Description: 
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 解决路由按需导入刷新红色警告
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  routes: [
    {
      path: '/home',
      component: () => import('@/views/common/home/Home.vue'),
      children:[
        {
          path: 'Downloaded',
          name: 'Downloaded',
          component: () => import('@/views/common/home/StockMedia/children/Downloaded/index.vue')
        },
        {
          path: 'Clips',
          name: 'Clips',
          component: () => import('@/views/common/home/StockMedia/children/Clips/index.vue')
        },
        {
          path: 'Videos',
          name: 'Videos',
          component: () => import('@/views/common/home/StockMedia/children/Videos/index.vue')
          // component: () => import('@/views/common/home/StockMedia/children/Videos/indextest.vue')
        },
        {
          path: 'Photos',
          name: 'Photos',
          // component: () => import('@/views/common/home/StockMedia/children/Photos/index.vue')
          component: () => import('@/views/common/home/StockMedia/children/Photos/index_copy.vue')
        },
        {
          path: 'Gifs',
          name: 'Gifs',
          component: () => import('@/views/common/home/StockMedia/children/Gifs/index.vue')
        },
        {
          path: 'Stickers',
          name: 'Stickers',
          component: () => import('@/views/common/home/StockMedia/children/Stickers/index.vue')
        },
        {
          path: '/home',
          redirect: 'Downloaded'
        },
      ]
    },
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/views/404/index.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
