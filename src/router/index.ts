import { createRouter, createWebHistory } from 'vue-router'
import Detail from '../views/Detail.vue'
import Home from '../views/Home.vue'
import SentencesToCardsView from '../views/SentencesToCardsView.vue'

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
    {
      path: '/sentences-to-cards',
      name: 'sentences-to-cards',
      component: SentencesToCardsView,
    },
  ],
})

export default router
