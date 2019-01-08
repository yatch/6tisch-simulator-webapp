import Vue from 'vue'
import Vuex from 'vuex'
import App from './modules/App.js'
import Simulator from './modules/Simulator.js'
import Log from './modules/Log.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app: App,
    simulator: Simulator,
    log: Log
  }
})
