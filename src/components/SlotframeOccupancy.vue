<template>
<v-card width="200px">
  <v-tooltip bottom>
    <div slot="activator">
      <v-card-title>Slotframe Occupancy</v-card-title>
      <v-card-text>
        <p><span class="title">Max: {{ max }} </span>cells</p>
        <p><span class="title">Min: {{ min }} </span>cells</p>
      </v-card-text>
    </div>
    <span>
      The number of scheduled cells in one slotframe.
    </span>
  </v-tooltip>
</v-card>
</template>

<script>
export default {
  data() {
    return {
      numCellsArray: [],
      maxNumCells: undefined,
      minNumCells: undefined
    }
  },
  watch: {
    operationalStatus (newStatus, oldStatus) {
      if (newStatus === 'running' && oldStatus === 'ready') {
        this.reset()
      }
    },
    lastTschCellAllocationEvent (event) {
      if (event === undefined) {
        // ignore
        return
      }
      if (event.type === 'add') {
        this.numCellsArray[event.moteId] += 1
      } else {
        this.numCellsArray[event.moteId] -= 1
      }
      this.maxNumCells = Math.max(...this.numCellsArray)
      this.minNumCells = Math.min(...this.numCellsArray)
    }
  },
  computed: {
    operationalStatus () {
      return this.$store.getters['simulator/operationalStatus']
    },
    runningSettings () { return this.$store.getters['simulator/settings'] },
    lastTschCellAllocationEvent () {
      return this.$store.getters['log/lastTschCellAllocationEvent']
    },
    max () {
      if (this.maxNumCells === undefined) {
        return 'N/A'
      } else {
        return this.maxNumCells
      }
    },
    min () {
      if (this.minNumCells === undefined) {
        return 'N/A'
      } else {
        return this.minNumCells
      }
    }
  },
  methods: {
    reset () {
      this.numCellsArray = Array(this.runningSettings.exec_numMotes).fill(0)
      this.maxNumCells = undefined
      this.minNumCells = undefined
    }
  }
}
</script>
