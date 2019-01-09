export default {
  namespaced: true,
  state: {
    navigationDrawer: false,
    aboutDialog: false
  },
  getters: {
    navigationDrawer (state) { return state.navigationDrawer },
    aboutDialog (state) { return state.aboutDialog }
  },
  mutations: {
    setNavigationDrawer (state, value) {
      state.navigationDrawer = value
    },
    setAboutDialog (state, value) { state.aboutDialog = value }
  },
  actions: {
    toggleNavigationDrawer ({ state, commit }) {
      commit('setNavigationDrawer', !state.navigationDrawer)
    },
    setAboutDialog ({ commit }, newValue) {
      commit('setAboutDialog', newValue)
    }
  }
}
