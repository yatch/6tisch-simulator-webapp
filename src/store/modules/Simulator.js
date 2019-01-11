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
    connectionStatus: 'disconnected',
    operationalStatus: null,
    settings: null,
    availableSFs: [],
    availableConnectivities: [],
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
      state.settings = Object.assign({}, newSettings)
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
    start ({ state, commit, dispatch }, eel) {
      dispatch('simulation/reset', null, { root: true })
      commit('changeOperationalStatus', 'running')
      eel.start(state.settings, state.defaultLogFilter)(() => {
        commit('changeOperationalStatus', 'ready')
      })
    },
    pause ({ commit }, eel) {
      eel.pause()(() => {
        commit('changeOperationalStatus', 'paused')
      })
    },
    resume ({ commit }, eel) {
      eel.resume()(() => {
        commit('changeOperationalStatus', 'running')
      })
    },
    abort ({ commit, dispatch }, eel) {
      eel.abort()(() => {
        commit('changeOperationalStatus', 'aborted')
        dispatch('simulation/reset', null, { root: true })
        commit('changeOperationalStatus', 'ready')
      })
    },
    saveSettings ({ commit }, settings) {
      if (settings !== null &&
          settings.exec_randomSeed === 'random') {
        // pick an integer for the default seed
        settings.exec_randomSeed = Math.floor(Math.random() * 10000)
      }
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
