<template>
<BaseKPICard>
  <span slot="title">Overall E2E PDR</span>
  <span slot="main-contents">{{ pdr }}</span>
  <v-flex slot="sub-contents">
    <v-container
      pa-0
      ma-0
      >
      <v-layout
        v-for="item in items"
        :key="item.name"
        justify-center
        >
        <v-flex
          xs2
          class="caption"
          >
          {{ item.name }}
        </v-flex>
        <v-flex
          xs3
          class="caption"
          text-xs-right
          >
          {{ item.value }}
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
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
    },
    items () {
      return [
        { name: 'numTx', value: this.numTx },
        { name: 'numRx', value: this.numRx },
        { name: 'numDrop', value: this.numDrop }
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
