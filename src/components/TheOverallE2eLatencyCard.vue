<template>
<BaseKPICard>
  <span slot="title">Overall E2E Latency</span>
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
        <v-flex xs2 md3>{{ item.name | capitalize }}</v-flex>
        <v-flex xs3 md4 text-xs-right>{{ item.value | latencyString }}</v-flex>
      </v-layout>
    </v-container>
  </v-flex>
  <span slot="help">
    Average, maximum, and minimum value of End-to-End latency samples
    since the beginning of the simulation
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
  filters: {
    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    latencyString (latency) {
      if (latency === null) {
        return 'N/A'
      } else {
        return latency.toFixed(2).toString() + 's'
      }
    }
  },
  mixins: [Simulator, Simulation],
  data () {
    return {
      sum: 0,
      numRecords: 0,
      max: null,
      min: null
    }
  },
  computed: {
    avg () {
      if (this.numRecords === 0) {
        return null
      } else {
        return this.sum / this.numRecords
      }
    },
    items () {
      return [
        { name: 'avg', value: this.avg },
        { name: 'max', value: this.max },
        { name: 'min', value: this.min }
      ]
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
          const slotDuration = this.$_simulator_runningSettings.tsch_slotDuration
          const latency = ((event.asn - event.packet.app.timestamp) *
                           slotDuration)
          this.sum += latency
          this.numRecords += 1
          if (this.max === null || this.max < latency) {
            this.max = latency
          }
          if (this.min === null || latency < this.min) {
            this.min = latency
          }
        }
      }
    }
  },
  methods: {
    reset () {
      this.sum = 0
      this.numRecords = 0
      this.max = null
      this.min = null
    }
  }
}
</script>
