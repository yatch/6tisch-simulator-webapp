<template>
<v-flex xs8>
<v-card height="100%">
  <v-container>
    <v-layout>
      <v-flex class="body-2">TSCH Schedule</v-flex>
    </v-layout>
    <v-flex>
      <div id="draw-shapes"></div>
      <v-card-text v-if="showText">
        <div>(SlotOffset=0, ChannelOffset=0) is on the upper left</div>
        <div>(SlotOffset={{ this.numSlots - 1}}, ChannelOffset={{ this.numChannels - 1 }}) is on the lower right</div>
        <div>
          <span><font class="title">&#9633;</font>No Cell, </span>
          <span><font class="title" color="blue">&#9632;</font>One TX Cell, </span>
          <span><font class="title" color="orange">&#9632;</font>Two TX Cells, </span>
          <span><font class="title" color="red">&#9632;</font>More than two Tx Cells on that spot (SlotOffset/ChannelOffset)</span>
        </div>
      </v-card-text>
    </v-flex>
  </v-container>
  </v-card>
</v-flex>
</template>

<script>
import Two from 'two.js'

export default {
  modules: {
    Two
  },
  data () {
    return {
      two: undefined,
      cells: [],
      canvasWidth: 740,
      canvasHeight: 130,
      cellWidth: 7,
      cellHeight: 7,
      leftPadding: 10,
      topPadding: 20,
      showText: false
    }
  },
  mounted () {
    this.createScheduleMatrix()
    if (this.runningSettings !== undefined) {
      this.initializeScheduleMatrix()
    }
  },
  watch: {
    operationalStatus (newState, oldState) {
      if (newState === 'running' && oldState === 'ready') {
        if (this.two === 'undefined') {
          this.createScheduleMatrix()
        } else {
          this.clearScheduleMatrix()
        }
      }
    },
    runningSettings (newSettings) {
      if (newSettings !== undefined) {
        this.initializeScheduleMatrix()
      }
    },
    lastTschCellAllocationEvent (event) {
      if (event === undefined) {
        // ignore
        return
      }
      const cell = this.cells[event.slotOffset][event.channelOffset]
      if (event.cellOptions.includes('TX')) {
        if (event.type === 'add') {
          this.updateNumTxCells(cell, cell.numTxCells + 1)
        } else if (event.type === 'delete') {
          this.updateNumTxCells(cell, cell.numTxCells - 1)
        }
      }
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
    numSlots () {
      if (this.runningSettings === undefined) {
        return 1
      } else {
        return this.runningSettings.tsch_slotframeLength
      }
    },
    numChannels () {
      if (this.runningSettings === undefined) {
        return 1
      } else {
        return this.runningSettings.phy_numChans
      }
    }
  },
  methods: {
    createScheduleMatrix () {
      this.two = new Two(
        { width: this.canvasWidth, height: this.canvasHeight }
      ).appendTo(document.getElementById('draw-shapes'))
      this.cells = []
    },
    initializeScheduleMatrix () {
      if (this.two === undefined) {
        this.createScheduleMatrix()
      } else {
        this.two.clear()
      }

      Array.from({length: this.numSlots}, (v, slotOffset) => {
        this.cells[slotOffset] = []
        Array.from({length: this.numChannels}, (w, channelOffset) => {
          const x = slotOffset * this.cellWidth + this.leftPadding
          const y = channelOffset * this.cellHeight + this.topPadding
          const cell = this.two.makeRectangle(x, y, this.cellWidth, this.cellHeight)
          // add a custom variable
          cell.numTxCells = 0
          this.cells[slotOffset].push(cell)
        })
      })
      this.two.update()
      this.showText = true
    },
    clearScheduleMatrix () {
      Array.from({length: this.numSlots}, (v, slotOffset) => {
        Array.from({length: this.numChannels}, (w, channelOffset) => {
          const cell = this.cells[slotOffset][channelOffset]
          cell.numTxCells = 0
          cell.noFill()
        })
      })
      this.two.update()
    },
    updateNumTxCells (cell, value) {
      cell.numTxCells = value
      if (value === 0) {
        cell.noFill()
      } else if (value === 1) {
        cell.fill = 'blue'
      } else if (value === 2) {
        cell.fill = 'orange'
      } else {
        cell.fill = 'red'
      }
      this.two.update()
    }
  }
}
</script>
