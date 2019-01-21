<template>
<BaseKPICard>
  <span slot="title">Mote Stats</span>
  <v-flex slot="main-contents">
    <v-container
      pa-0
      ma-0
      >
      <v-layout
        v-for="item in items"
        :key="item.name"
        justify-center
        >
        <v-flex xs2 md2>{{ item.name | capitalize }}</v-flex>
        <v-flex xs3 md7 text-xs-right>{{ item.value }}</v-flex>
      </v-layout>
    </v-container>
  </v-flex>
  <span slot="help">
    The numbers of motes in the network, of synchronized motes, and of
    securelly joined motes.
  </span>
</BaseKPICard>
</template>

<script>
import Simulation from '@/mixins/Simulation'
import Simulator from '@/mixins/Simulator'
import BaseKPICard from '@/components/BaseKPICard'

export default {
  components: {
    BaseKPICard
  },
  mixins: [Simulator, Simulation],
  filters: {
    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  data() {
    return {
      numMotes: 0,
      numSynced: 0,
      numJoined: 0
    }
  },
  computed: {
    items () {
      return [
        { name: 'Total', value: this.numMotes },
        { name: 'Synced', value: this.numSynced },
        { name: 'SecJoined', value: this.numJoined },
      ]
    }
  },
  watch: {
    $_simulator_operationalStatus (newStatus, oldStatus) {
      if (newStatus === 'running' && oldStatus === 'ready') {
        this.numMotes = this.$_simulator_runningSettings.exec_numMotes
      }
    },
    $_simulation_lastTschSyncEvent (newEvent) {
      if (newEvent._type === 'tsch.synced') {
        this.numSynced += 1
      } else if (newEvent._type === 'tsch.desynced') {
        this.numSynced -= 1
      }
    },
    $_simulation_lastSecJoinEvent (newEvent) {
      if (newEvent._type === 'secjoin.joined') {
        this.numJoined += 1
      }
    }
  },
  methods: {
    reset () {
      this.numMotes = 0
      this.numSynced = 0
      this.numJoined = 0
    }
  }
}
</script>
