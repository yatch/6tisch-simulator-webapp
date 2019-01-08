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
    lastLogEvent: undefined,
    lastRplParentChangeEvent: undefined,
    appTxNum: 0,
    appRxNum: 0,
    appDropNum: 0,
    appLatencySum: 0,
    appLatencyNumRecords: 0,
    appLatencyMax: undefined,
    appLatencyMin: undefined,
    motes: [],
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

    resetAppTxNum (state) { state.appTxNum = 0},
    incrementAppTxNum (state) { state.appTxNum += 1 },

    resetAppRxNum (state) { state.appRxNum = 0},
    incrementAppRxNum (state) { state.appRxNum += 1
                              },
    resetAppDropNum (state) { state.appDropNum = 0},
    incrementAppDropNum (state) { state.appDropNum += 1 },

    resetAppLatencySum (state) { state.appLatencySum = 0},
    addAppLatencySum (state, payload) { state.appLatencySum += payload.newAppLatency },

    resetAppLatencyNumRecord (state) { state.appLatencyNumRecords = 0},
    incrementAppLatencyNumRecord (state) { state.appLatencyNumRecords += 1},

    resetAppLatencyMax (state) { state.appLatencyMax = undefined},
    updateAppLatencyMax (state, payload) {
      if (state.appLatencyMax === undefined || state.appLatencyMax < payload.newAppLatency) {
        state.appLatencyMax = payload.newAppLatency
      }
    },

    resetAppLatencyMin (state) { state.appLatencyMin = undefined },
    updateAppLatencyMin (state, payload) {
      if (state.appLatencyMin === undefined || payload.newAppLatency < state.appLatencyMin) {
        state.appLatencyMin = payload.newAppLatency
      }
    },

    resetTschLastCellAllocationEvent (state) { state.tschLastAllocationEvent = undefined },
    updateTschLastCellAllocationEvent (state, payload) { state.tschLastAllocationEvent = payload.newCellAllocation },
    incrementMoteNumCells (state, payload) { state.motes[payload.moteId].numCells += 1 },
    decrementMoteNumCells (state, payload) { state.motes[payload.moteId].numCells -= 1 },

    setEUI64Addr (state, payload) { state.motes[payload.moteId].eui64Addr = payload.eui64Addr },
    setRplParentId (state, payload) {
      state.motes[payload.moteId].rplParentId = payload.rplParentId
    },
    setLastRplParentChangeEvent (state, payload) {
      state.lastRplParentChangeEvent = payload.rplParentChangeEvent
    },

    changeSimulatorState (state, payload) {
      state.simulator = payload.newState
    },

    resetMoteState (state) {
      state.motes = []
    },
    initMoteState (state) {
      const exec_numMotes = state.settings.exec_numMotes
      state.motes = Array(exec_numMotes).fill().map(() => ({
        eui64Addr: undefined,
        numCells: 0,
        rplParentId: undefined
      }))
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
      if (logEvent._type === 'app.rx' ||
          logEvent._type === 'packet_dropped' && logEvent.packet.type === 'DATA') {
        context.dispatch('putAppPacketReceptionEvent', logEvent)
      } else if (logEvent._type === 'tsch.add_cell' ||
          logEvent._type === 'tsch.delete_cell') {
        context.dispatch('putTschCellAllocationEvent', logEvent)
      } else if (logEvent._type === 'mac.add_addr' && logEvent.type === 'eui64') {
        context.commit('setEUI64Addr', {
          moteId: parseInt(logEvent._mote_id),
          eui64Addr: logEvent.addr
        })
      } else if (logEvent._type === 'rpl.churn') {
        const childId = logEvent._mote_id
        let newParentId
        if (logEvent.preferredParent != null) {
          newParentId = context.state.motes.findIndex(mote => {
            return mote.eui64Addr === logEvent.preferredParent
          })
        } else {
          newParentId = undefined
        }
        const oldParentId = context.state.motes[childId].rplParentId
        context.commit('setRplParentId', { moteId: logEvent._mote_id, rplParentId: newParentId })
        context.commit('setLastRplParentChangeEvent', {
          rplParentChangeEvent: { childId, oldParentId, newParentId }
        })
      }
    },
    putAppPacketReceptionEvent (context, event) {
      context.commit('incrementAppTxNum')
      if (event._type === 'app.rx') {
        context.commit('incrementAppRxNum')
        const slotDuration = context.state.settings.tsch_slotDuration
        const newAppLatency = (event._asn - event.packet.app.timestamp) * slotDuration
        context.commit('addAppLatencySum', { newAppLatency })
        context.commit('incrementAppLatencyNumRecord')
        context.commit('updateAppLatencyMax', { newAppLatency })
        context.commit('updateAppLatencyMin', { newAppLatency })
      } else {
        // logEvent._type === 'packet_dropped'
        context.commit('incrementAppDropNum')
      }
    },
    putTschCellAllocationEvent (context, event) {
      const newCellAllocation = {
        type: event._type,
        moteId: event._mote_id,
        slotFrameHandle: event.slotFrameHandle,
        slotOffset: event.slotOffset,
        channelOffset: event.channelOffset,
        neighbor: event.neighbor,
        cellOptions: event.cellOptions
      }
      context.commit('updateTschLastCellAllocationEvent', { newCellAllocation })
      if (newCellAllocation.type === 'tsch.add_cell') {
        context.commit('incrementMoteNumCells', { moteId: newCellAllocation.moteId })
      } else if (newCellAllocation.type === 'tsch.add_cell') {
        context.commit('decrementMoteNumCells', { moteId: newCellAllocation.moteId })
      }
    },
    startSimulation (context) {
      context.dispatch('clearSimulationState')
      context.commit('initMoteState')
      context.commit('changeSimulatorState', { newState: 'running' })
      window.eel.start(
        context.state.settings,
        [
          'app.rx',
          'packet_dropped',
          'tsch.add_cell',
          'tsch.delete_cell',
          'rpl.churn'
        ]
      )(() => {
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
        context.dispatch('clearSimulationState')
        context.commit('changeSimulatorState', { newState: 'ready' })
      })
    },
    clearSimulationState (context) {
      context.commit('updateCurrentSlotframeNumber', { logEvent: undefined })
      context.commit('setLastLogEvent', { logEvent: undefined })
      context.commit('resetAppTxNum')
      context.commit('resetAppRxNum')
      context.commit('resetAppDropNum')
      context.commit('resetAppLatencySum')
      context.commit('resetAppLatencyNumRecord')
      context.commit('resetAppLatencyMax')
      context.commit('resetAppLatencyMin')
      context.commit('resetTschLastCellAllocationEvent')
      context.commit('resetMoteState')
      context.commit('setLastRplParentChangeEvent', { rplParentChangeEvent: undefined })
    }
  }
})
