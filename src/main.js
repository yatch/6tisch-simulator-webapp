import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'
import router from './router'
import './plugins/cytoscape'
import './plugins/apexchart'

Vue.config.productionTip = false

window.vm = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
