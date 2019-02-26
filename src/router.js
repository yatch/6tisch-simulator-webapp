import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/views/Dashboard'
import Results from '@/views/Results'
import TraceFiles from '@/views/TraceFiles'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'Dashboard',
      path: '/',
      component: Dashboard
    },
    {
      name: 'Results',
      path: '/results',
      component: Results
    },
    {
      name: 'Trace Files',
      path: '/traces',
      component: TraceFiles
    }
  ]
})
