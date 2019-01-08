import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    connection: 'unknown',
    navigationDrawer: false,
    settings: undefined,
    availableSFs: undefined,
    availableConnectivities: undefined,
    simulator: undefined,
    currentSlotframeNumber: undefined,
    lastLogEvent: undefined
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
    },
    updateCurrentSlotframeNumber (state, payload) {
      if (payload.logEvent === undefined) {
        state.currentSlotframeNumber = undefined
      } else {
        const slotframeLength = state.settings.tsch_slotframeLength
        state.currentSlotframeNumber = payload.logEvent._asn / slotframeLength
      }
    },
    setLastLogEvent (state, payload) {
      state.lastLogEvent = payload.logEvent
    },
    changeSimulatorState (state, payload) {
      state.simulator = payload.newState
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
      if (newSettings !== undefined) {
        context.commit('changeSimulatorState', { newState: 'ready' })
      }
    },
    saveAvailableSFs (context, availableSFs) {
      context.commit('saveAvailableSFs', { availableSFs })
    },
    saveAvailableConnectivities (context, availableConnectivities) {
      context.commit('saveAvailableConnectivities', { availableConnectivities })
    },
    putLogEvent (context, logEvent) {
      context.commit('updateCurrentSlotframeNumber', { logEvent })
      context.commit('setLastLogEvent', { logEvent })
    },
    startSimulation (context) {
      context.commit('updateCurrentSlotframeNumber', { logEvent: undefined })
      context.commit('setLastLogEvent', { logEvent: undefined })
      context.commit('changeSimulatorState', { newState: 'running' })
      window.eel.start(context.state.settings)(() => {
        // a simulation is done
        context.commit('changeSimulatorState', { newState: 'ready' })
      })
    },
    pauseSimulation (context) {
      window.eel.pause()(() => {
        context.commit('changeSimulatorState', { newState: 'paused' })
      })
    },
    resumeSimulation (context) {
      window.eel.resume()(() => {
        context.commit('changeSimulatorState', { newState: 'running' })
      })
    },
    abortSimulation (context) {
      window.eel.abort()(() => {
        context.commit('updateCurrentSlotframeNumber', { logEvent: undefined })
        context.commit('setLastLogEvent', { logEvent: undefined })
        context.commit('changeSimulatorState', { newState: 'ready' })
      })
    }
  }
})
