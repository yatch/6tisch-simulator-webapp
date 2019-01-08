export default {
  namespaced: true,
  state: {
    navigationDrawer: false
  },
  getters: {
    navigationDrawer (state) { return state.navigationDrawer }
  },
  mutations: {
    setNavigationDrawer (state, value) {
      state.navigationDrawer = value
    }
  },
  actions: {
    toggleNavigationDrawer ({ state, commit }) {
      commit('setNavigationDrawer', !state.navigationDrawer)
    }
  }
}
