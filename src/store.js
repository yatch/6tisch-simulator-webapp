import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    connection: 'unknown',
    navigationDrawer: false
  },
  mutations: {
    changeConnectionState (state, payload) {
      state.connection = payload.state
    },
    changeNavigationDrawerState (state, payload) {
      state.navigationDrawer = payload.state
    }
  },
  actions: {
    changeConnectionState (context, state) {
      context.commit('changeConnectionState', { state })
    },
    changeNavigationDrawerState (context, state) {
      context.commit('changeNavigationDrawerState', { state })
    }
  }
})
