<template>
<BaseKPICard>
  <span slot="title">Slotframe Occupancy</span>
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
        <v-flex xs3 md4 text-xs-right>{{ item.value | numCellsString }}</v-flex>
      </v-layout>
    </v-container>
  </v-flex>
  <span slot="help">
    Maximum / minimum number of cells in one slotframe which a mote schedules
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
    },
    numCellsString (numCells) {
      if (numCells === null) {
        return 'N/A'
      } else {
        return numCells.toString() + ' cells'
      }
    }
  },
  data() {
    return {
      numCellsArray: [],
      maxNumCells: null,
      minNumCells: null
    }
  },
  computed: {
    max () {
      if (this.numCellsArray.length === 0) {
        return null
      } else {
        return Math.max(...this.numCellsArray) }
    },
    min () {
      if (this.numCellsArray.length === 0) {
        return null
      } else {
        return Math.min(...this.numCellsArray) }
    },
    items () {
      return [
        { name: 'max', value: this.max },
        { name: 'min', value: this.min },
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
    $_simulation_lastTschCellAllocationEvent (event) {
      if (event !== null) {
        if (event.type === 'add') {
          this.numCellsArray[event.moteId] += 1
        } else if (event.type === 'delete') {
          this.numCellsArray[event.moteId] -= 1
        }
        // we need to assign a new Array object so that max and min
        // will be updated
        this.numCellsArray = this.numCellsArray.slice()
      }
    }
  },
  methods: {
    reset () {
      this.numCellsArray = (
        Array(this.$_simulator_runningSettings.exec_numMotes).fill(0)
      )
      this.maxNumCells = null
      this.minNumCells = null
    }
  }
}
</script>
