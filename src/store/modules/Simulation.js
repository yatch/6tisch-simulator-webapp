export default {
  namespaced: true,
  state: {
    lastRplParentChangeEvent: null,
    lastTschCellAllocationEvent: null,
    lastAppPacketEvent: null,
    lastPacketDropEvent: null,
    lastTschSyncEvent: null,
    lastSecJoinEvent: null,
    elapsedMinutes: null,
    motes: []
  },
  getters: {
    lastRplParentChangeEvent (state) { return state.lastRplParentChangeEvent },
    lastTschCellAllocationEvent (state) {
      return state.lastTschCellAllocationEvent
    },
    lastAppPacketEvent (state) { return state.lastAppPacketEvent },
    lastPacketDropEvent (state) { return state.lastPacketDropEvent },
    lastTschSyncEvent (state) { return state.lastTschSyncEvent },
    lastSecJoinEvent (state) { return state.lastSecJoinEvent },
    elapsedMinutes (state) { return state.elapsedMinutes}
  },
  mutations: {
    updateLastRplParentChangeEvent (state, event) {
      if (event === null) {
        return
      }
      const childId = event._mote_id
      const oldParentId = state.motes[childId].rplParentId
      let newParentId
      if (event.preferredParent == null) {
        newParentId = null
      } else {
        newParentId = state.motes.findIndex(mote => {
          return mote.eui64Addr === event.preferredParent
        })
      }
      state.motes[childId].rplParentId = newParentId
      state.lastRplParentChangeEvent = { childId, oldParentId, newParentId }
    },
    updateLastTschCellAllocationEvent (state, event) {
      if (event === null) {
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
      if (event === null) {
        state.lastAppPacketEvent = null
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
    updateLastPacketDropEvent (state, event) {
      if (event === null) {
        state.lastPacketDropEvent = null
      } else {
        state.lastPacketDropEvent = {
          'asn': event._asn,
          'moteId': event._mote_id,
          'packetType': event.packet.type,
          'dropReason': event.reason,
        }
      }
    },
    updateLastTschSyncEvent (state, event) { state.lastTschSyncEvent = event },
    updateLastSecJoinEvent (state, event) { state.lastSecJoinEvent = event },
    updateElapsedMinutes (state, value) { state.elapsedMinutes = value },
    updateMoteAddress (state, event) {
      if (event === null) {
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
        eui64Addr: null,
        ipv6LinkLocalAddr: null,
        ipv6GlobalAddr: null,
        rplParentId: null
      }))
    }
  },
  actions: {
    put ({ commit }, event) {
      if (event._type === '_backend.tick.minute') {
        commit('updateElapsedMinutes', event.currentValue)
      } else if (event._type === 'app.rx') {
        commit('updateLastAppPacketEvent', event)
      } else if (event._type === 'packet_dropped') {
        if (event.packet.type === 'DATA') {
          commit('updateLastAppPacketEvent', event)
        }
        commit('updateLastPacketDropEvent', event)
      } else if (event._type === 'mac.add_addr' && event.type === 'eui64') {
        commit('updateMoteAddress', event)
      } else if (event._type === 'tsch.add_cell' ||
                 event._type === 'tsch.delete_cell') {
        commit('updateLastTschCellAllocationEvent', event)
      } else if (event._type === 'rpl.churn') {
        commit('updateLastRplParentChangeEvent', event)
      } else if (event._type === 'tsch.synced' ||
                 event._type === 'tsch.desynced') {
        commit('updateLastTschSyncEvent', event)
      } else if (event._type === 'secjoin.joined' ||
                 event._type === 'secjoin.unjoined') {
        commit('updateLastSecJoinEvent', event)
      }
    },
    reset ( { commit, rootGetters }) {
      commit('updateElapsedMinutes', 0)
      commit('updateLastAppPacketEvent', null)
      commit('updateLastPacketDropEvent', null)
      commit('updateLastTschCellAllocationEvent', null)
      commit('updateLastRplParentChangeEvent', null)
      commit('initializeMotes',
             rootGetters['simulator/runningSettings'].exec_numMotes)
    }
  }
}
