export default {
  namespaced: true,
  state: {
    defaultLogFilter: [
      'app.rx',
      'packet_dropped',
      'tsch.add_cell',
      'tsch.delete_cell',
      'rpl.churn'
    ],
    connectionStatus: null,
    operationalStatus: null,
    settings: null,
    availableSFs: null,
    availableConnectivities: null,
    gitInfo: null
  },
  getters: {
    connectionStatus (state) { return state.connectionStatus },
    operationalStatus (state) { return state.operationalStatus },
    settings (state) { return state.settings },
    availableSFs (state) { return state.availableSFs },
    availableConnectivities (state) { return state.availableConnectivities },
    gitInfo (state) { return state.gitInfo }
  },
  mutations: {
    changeConnectionStatus (state, newStatus) {
      state.connectionStatus = newStatus
    },
    changeOperationalStatus (state, newStatus) {
      state.operationalStatus = newStatus
    },
    updateSettings (state, newSettings) {
      state.settings = newSettings
    },
    setAvailableSFs (state, sfList) {
      state.availableSFs = sfList
    },
    setAvailableConnectivities (state, connList) {
      state.availableConnectivities = connList
    },
    setGitInfo (state, gitInfo) { state.gitInfo = gitInfo }
  },
  actions: {
    disconnect ({ commit }) {
      commit('changeConnectionStatus', 'disconnected')
    },
    connect ({ commit }) {
      commit('changeConnectionStatus', 'connected')
    },
    start ({ state, commit, dispatch }) {
      dispatch('log/reset', null, { root: true })
      commit('changeOperationalStatus', 'running')
      window.eel.start(state.settings, state.defaultLogFilter)(() => {
        commit('changeOperationalStatus', 'ready')
      })
    },
    pause ({ commit }) {
      window.eel.pause()(() => {
        commit('changeOperationalStatus', 'paused')
      })
    },
    resume ({ commit }) {
      window.eel.resume()(() => {
        commit('changeOperationalStatus', 'running')
      })
    },
    abort ({ commit }) {
      window.eel.abort()(() => {
        commit('changeOperationalStatus', 'aborted')
        commit('changeOperationalStatus', 'ready')
      })
    },
    saveSettings ({ commit }, settings) {
      commit('updateSettings', settings)
      if (settings !== null) {
        commit('changeOperationalStatus', 'ready')
      }
    },
    setAvailableSFs ({ commit }, sfList) {
      commit('setAvailableSFs', sfList)
    },
    setAvailableConnectivities ({ commit }, connList) {
      commit('setAvailableConnectivities', connList)
    },
    setGitInfo ({ commit }, gitInfo) { commit('setGitInfo', gitInfo) }
  }
}
