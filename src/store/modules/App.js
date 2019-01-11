export default {
  namespaced: true,
  state: {
    navigationDrawer: false,
    aboutDialog: false,
    status: 'starting'
  },
  getters: {
    navigationDrawer (state) { return state.navigationDrawer },
    aboutDialog (state) { return state.aboutDialog },
    status (state) { return state.status }
  },
  mutations: {
    setNavigationDrawer (state, value) {
      state.navigationDrawer = value
    },
    setAboutDialog (state, value) { state.aboutDialog = value },
    setStatus (state, newStatus) { state.status = newStatus }
  },
  actions: {
    toggleNavigationDrawer ({ state, commit }) {
      commit('setNavigationDrawer', !state.navigationDrawer)
    },
    setAboutDialog ({ commit }, newValue) {
      commit('setAboutDialog', newValue)
    },
    setStatus ({ commit }, newStatus) {
      commit('setStatus', newStatus)
    }
  }
}
