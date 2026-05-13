import { createRouter, createWebHistory } from 'vue-router'
import Detail from '../views/Detail.vue'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/post',
      name: 'post-detail',
      component: Detail,
    },
  ],
})

export default router
