import Vue from 'vue'
import Router from 'vue-router'
import DashBoard from '@/views/DashBoard.vue'
import Configuration from '@/views/Configuration.vue'
import Results from '@/views/Results.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'dashboard',
      path: '/',
      component: DashBoard
    },
    {
      name: 'config',
      path: '/config',
      component: Configuration
    },
    {
      name: 'results',
      path: '/results',
      component: Results
    },
  ]
})
