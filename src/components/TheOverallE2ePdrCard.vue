<template>
<BaseKPICard>
  <span slot="title">Overall E2E PDR</span>
  <span slot="main-contents">{{ pdr }}</span>
  <div slot="sub-contents">
    <v-layout justify-center>
      <v-flex xs10>
        <v-divider/>
      </v-flex>
    </v-layout>
    <v-layout
      align-center
      justify-center
      row wrap
      text-xs-center
      >
      <v-flex xs3>TX: {{ numTx }}</v-flex>
      <v-flex xs3>RX: {{ numRx }}</v-flex>
      <v-flex xs3>Drop: {{ numDrop }}</v-flex>
    </v-layout>
  </div>
  <span slot="help">
    End-to-End PDR since the beginning of the simulation
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
  data () {
    return {
      numTx: 0,
      numRx: 0,
      numDrop: 0
    }
  },
  computed: {
    pdr () {
      if (this.numTx === 0) {
        return 'N/A'
      } else {
        return (this.numRx / this.numTx * 100).toFixed(3).toString() + '%'
      }
    }
  },
  watch: {
    $_simulator_operationalStatus (newStatus, oldStatus) {
      if ((newStatus === 'running' && oldStatus === 'ready') ||
          (newStatus === 'aborted')) {
        this.reset()
      }
    },
    $_simulation_lastlastAppPacketEvent (event) {
      if (event !== null) {
        this.numTx += 1
        if (event.type === 'rx') {
          this.numRx += 1
        } else {
          this.numDrop += 1
        }
      }
    }
  },
  methods: {
    reset () {
      this.numTx = 0
      this.numRx = 0
      this.numDrop = 0
    }
  }
}
</script>
