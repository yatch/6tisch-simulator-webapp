<template>
<v-flex xs3>
  <v-card height="100%">
    <v-container>
      <v-layout>
        <v-flex class="subheading">Slotframe Occupancy:</v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <v-container>
            <v-layout class="title" my-2 align-end>
              <v-flex xs1 offset-xs2>Max</v-flex>
              <v-flex xs5 offset-xs2 text-xs-right>
                {{ max }}
                <span v-if="printCells" class="body-1">cells</span>
              </v-flex>
            </v-layout>
            <v-layout class="title" my-2 align-end>
              <v-flex xs1 offset-xs2>Min</v-flex>
              <v-flex xs5 offset-xs2 text-xs-right>
                {{ min }}
                <span v-if="printCells" class="body-1">cells</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</v-flex>
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
    printCells () {
      if (this.maxNumCells === undefined) {
        return false
      } else {
        return true
      }
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
