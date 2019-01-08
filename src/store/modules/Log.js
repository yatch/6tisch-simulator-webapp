export default {
  namespaced: true,
  state: {
    lastRplParentChangeEvent: undefined,
    lastTschCellAllocationEvent: undefined,
    lastAppPacketEvent: undefined,
    elapsedMinutes: undefined,
    motes: []
  },
  getters: {
    lastRplParentChangeEvent (state) { return state.lastRplParentChangeEvent },
    lastTschCellAllocationEvent (state) {
      return state.lastTschCellAllocationEvent
    },
    lastAppPacketEvent (state) { return state.lastAppPacketEvent },
    elapsedMinutes (state) { return state.elapsedMinutes}
  },
  mutations: {
    updateLastRplParentChangeEvent (state, event) {
      if (event === undefined) {
        return
      }
      const childId = event._mote_id
      const oldParentId = state.motes[childId].rplParentId
      let newParentId
      if (event.preferredParent == null) {
        newParentId = undefined
      } else {
        newParentId = state.motes.findIndex(mote => {
          return mote.eui64Addr === event.preferredParent
        })
      }
      state.motes[childId].rplParentId = newParentId
      state.lastRplParentChangeEvent = { childId, oldParentId, newParentId }
    },
    updateLastTschCellAllocationEvent (state, event) {
      if (event === undefined) {
        return
      }
      let type
      if (event._type === 'tsch.add_cell') {
        type = 'add'
      } else if (event._type === 'tsch.delete_cell') {
        type = 'delete'
      }
      state.lastTschCellAllocationEvent = {
        type,
        moteId: event._mote_id,
        slotFrameHandle: event.slotFrameHandle,
        slotOffset: event.slotOffset,
        channelOffset: event.channelOffset,
        neighbor: event.neighbor,
        cellOptions: event.cellOptions
      }
    },
    updateLastAppPacketEvent (state, event) {
      if (event === undefined) {
        state.lastAppPacketEvent = undefined
      } else {
        let type
        if (event._type === 'app.rx') {
          type = 'rx'
        } else {
          type = 'drop'
        }
        state.lastAppPacketEvent = {
          type,
          asn: event._asn,
          packet: event.packet
        }
      }
    },
    updateElapsedMinutes (state, value) { state.elapsedMinutes = value },
    updateMoteAddress (state, event) {
      if (event === undefined) {
        return
      } else if (event._type === 'mac.add_addr' && event.type === 'eui64') {
        state.motes[event._mote_id].eui64Addr = event.addr
      } else if (event._type === 'ipv6.add_addr') {
        if (event.type === 'global') {
          state.motes[event._mote_id].ipv6GlobalAddr = event.addr
        } else {
          state.motes[event._mote_id].ipv6LinkLocalAddr = event.addr
        }
      }
    },
    initializeMotes (state, numMotes) {
      state.motes = Array(numMotes).fill().map(() => ({
        eui64Addr: undefined,
        ipv6LinkLocalAddr: undefined,
        ipv6GlobalAddr: undefined,
        rplParentId: undefined
      }))
    }
  },
  actions: {
    put ({ commit }, event) {
      if (event._type === '_backend.tick.minute') {
        commit('updateElapsedMinutes', event.currentValue)
      } else if (event._type === 'app.rx' ||
                 (event._type === 'packet_dropped' &&
                  event.packet.type === 'DATA')) {
        commit('updateLastAppPacketEvent', event)
      } else if (event._type === 'mac.add_addr' && event.type === 'eui64') {
        commit('updateMoteAddress', event)
      } else if (event._type === 'tsch.add_cell' ||
                 event._type === 'tsch.delete_cell') {
        commit('updateLastTschCellAllocationEvent', event)
      } else if (event._type === 'rpl.churn') {
        commit('updateLastRplParentChangeEvent', event)
      }
    },
    reset ( { commit, rootGetters }) {
      commit('updateElapsedMinutes', 0)
      commit('updateLastAppPacketEvent', undefined)
      commit('updateLastTschCellAllocationEvent', undefined)
      commit('updateLastRplParentChangeEvent', undefined)
      commit('initializeMotes', rootGetters['simulator/settings'].exec_numMotes)
    }
  }
}
