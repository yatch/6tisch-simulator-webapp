export default {
  namespaced: true,
  state: {
    navigationDrawer: false,
    shutdownDialog: false,
    autoReload: true,
    aboutDialog: false,
    settingsDialog: false,
    status: 'starting'
  },
  getters: {
    navigationDrawer (state) { return state.navigationDrawer },
    shutdownDialog (state) { return state.shutdownDialog },
    autoReload (state) { return state.autoReload },
    aboutDialog (state) { return state.aboutDialog },
    settingsDialog (state) { return state.settingsDialog },
    status (state) { return state.status }
  },
  mutations: {
    setNavigationDrawer (state, value) {
      state.navigationDrawer = value
    },
    setShutdownDialog (state, value) { state.shutdownDialog = value },
    setAutoReload (state, value) { state.autoReload = value },
    setAboutDialog (state, value) { state.aboutDialog = value },
    setConfigDialog (state, value) { state.settingsDialog = value },
    setStatus (state, newStatus) { state.status = newStatus }
  },
  actions: {
    toggleNavigationDrawer ({ state, commit }) {
      commit('setNavigationDrawer', !state.navigationDrawer)
    },
    setShutdownDialog ({ commit }, newValue) {
      commit('setShutdownDialog', newValue)
    },
    setAutoReload ({ commit }, newValue) {
      commit('setAutoReload', newValue)
    },
    setAboutDialog ({ commit }, newValue) {
      commit('setAboutDialog', newValue)
    },
    setConfigDialog ({ commit }, newValue) {
      commit('setConfigDialog', newValue)
    },
    setStatus ({ commit }, newStatus) {
      commit('setStatus', newStatus)
    }
  }
}
