import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    connection: 'unknown',
    navigationDrawer: false,
    settings: undefined,
    availableSFs: undefined,
    availableConnectivities: undefined
  },
  mutations: {
    changeConnectionState (state, payload) {
      state.connection = payload.state
    },
    changeNavigationDrawerState (state, payload) {
      state.navigationDrawer = payload.state
    },
    saveSettings (state, payload) {
      state.settings = payload.newSettings
    },
    saveAvailableSFs (state, payload) {
      state.availableSFs = payload.availableSFs
    },
    saveAvailableConnectivities (state, payload) {
      state.availableConnectivities = payload.availableConnectivities
    }
  },
  actions: {
    changeConnectionState (context, state) {
      context.commit('changeConnectionState', { state })
    },
    changeNavigationDrawerState (context, state) {
      context.commit('changeNavigationDrawerState', { state })
    },
    saveSettings (context, newSettings) {
      context.commit('saveSettings', { newSettings })
    },
    saveAvailableSFs (context, availableSFs) {
      context.commit('saveAvailableSFs', { availableSFs })
    },
    saveAvailableConnectivities (context, availableConnectivities) {
      context.commit('saveAvailableConnectivities', { availableConnectivities })
    }
  }
})
