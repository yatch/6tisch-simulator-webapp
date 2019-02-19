<template>
<v-flex
  xs12
  md11
  lg8
  >
  <v-tooltip bottom>
    <v-card slot="activator" height="100%">
      <v-layout
        align-center
        fill-height
        >
        <v-card-text>
          <v-layout
            align-center
            justify-center
            row
            wrap
            fill-height
            >
            <div
              id="draw-shapes"
              :hidden="showMatrix === false"
              />
          </v-layout>
          <v-layout
            v-if="showMatrix"
            row
            wrap
            text-xs-center
            >
            <v-flex
              xs12
              >
              <span><font class="title">&#9633;</font>No Cell, </span>
              <span><font class="title" color="blue">&#9632;</font>One TX Cell, </span>
              <span><font class="title" color="orange">&#9632;</font>Two TX Cells, </span>
              <span><font class="title" color="red">&#9632;</font>More than two Tx Cells on that spot (SlotOffset/ChannelOffset)</span>
              <br/>
              (SlotOffset=0, ChannelOffset=0) is on the upper left.
              (SlotOffset={{ this.numSlots - 1}}, ChannelOffset={{ this.numChannels - 1 }}) is on the lower right.
            </v-flex>
            <v-flex xs12><v-divider/></v-flex>
            <v-flex xs2>TX: {{ numTx.value }}</v-flex>
            <v-flex xs3>TX/SHARED: {{ numTxShared.value }}</v-flex>
            <v-flex xs2>RX: {{ numRx.value }}</v-flex>
            <v-flex xs2>TX/RX: {{ numTxRx.value }}</v-flex>
            <v-flex xs3>TX/RX/SHARED: {{ numTxRxShared.value }}</v-flex>
          </v-layout>
          <v-layout
            v-else
            justify-center>
            <v-progress-circular
              v-if="showProgress"
              indeterminate
              color="primary"
              />
            <v-flex
              v-else
              text-xs-center
              >
              <v-icon color="grey">error</v-icon>
              <font color="grey">{{ errorMessage }}</font>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-layout>
    </v-card>
    <span>
      <slot name="help">
        Live and global view of TSCH Schedule.
      </slot>
    </span>
  </v-tooltip>
</v-flex>
</template>

<script>
import Two from 'two.js'
import App from '@/mixins/App'
import Simulation from '@/mixins/Simulation'
import Simulator from '@/mixins/Simulator'

export default {
  mixins: [App, Simulator, Simulation],
  data () {
    return {
      two: null,
      matrixIsAvailable: false,
      errorMessage: null,
      cells: [],
      canvasWidth: 739,
      canvasHeight: 144,
      textStyles: { size: 10 },
      textWidth: 12,
      textHeight: 12,
      minCellWidth: 3,
      minCellHeight: 3,
      minLeftPadding: 10,
      minTopPadding: 10,
      numTx: { value: 0 },
      numTxShared: { value: 0 },
      numRx: { value: 0 },
      numTxRx: { value: 0 },
      numTxRxShared: { value: 0 }
    }
  },
  computed: {
    breakpoint () { return this.$vuetify.breakpoint },
    minBrowserWidthToDisplay () { return this.canvasWidth + 10 },
    showMatrix () {
      return this.matrixIsAvailable === true && this.errorMessage === null
    },
    showProgress () {
      return this.matrixIsAvailable === false && this.errorMessage === null
    },
    numSlots () {
      if (this.$_simulator_runningSettings === null) {
        return 1
      } else {
        return this.$_simulator_runningSettings.tsch_slotframeLength
      }
    },
    numChannels () {
      if (this.$_simulator_runningSettings === null) {
        return 1
      } else {
        return this.$_simulator_runningSettings.phy_numChans
      }
    }
  },
  watch: {
    breakpoint () {
      if (this.matrixIsAvailable === true &&
          this.breakpoint.width < this.minBrowserWidthToDisplay) {
        this.errorMessage = "Browser is too small"
      } else {
        this.errorMessage = null
      }
    },
    $_simulator_operationalStatus (newState, oldState) {
      if ((newState === 'running' && oldState === 'ready') ||
          (newState === 'aborted')) {
        this.clearScheduleMatrix()
      }
    },
    $_simulator_runningSettings (settings) {
      if (settings !== null) {
        this.initializeScheduleMatrix()
      }
    },
    $_simulation_lastTschCellAllocationEvent (event) {
      if (event !== null && this.matrixIsAvailable === true) {
        const cell = this.cells[event.slotOffset][event.channelOffset]
        if (event.cellOptions.includes('TX')) {
          if (event.type === 'add') {
            this.updateNumTxCells(cell, cell.numTxCells + 1)
          } else if (event.type === 'delete') {
            this.updateNumTxCells(cell, cell.numTxCells - 1)
          }
        }
        this.updateCounter(event)
      }
    }
  },
  mounted () {
    this.createScheduleMatrix()
    if (this.$_simulator_runningSettings !== null) {
      this.initializeScheduleMatrix()
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
      this.matrixIsAvailable = false
      this.errorMessage = null

      this.resetCounters()

      if (this.two === null) {
        this.createScheduleMatrix()
      } else {
        this.two.clear()
      }

      // determine the cell size
      let cellWidth = Math.floor((this.canvasWidth - this.minLeftPadding * 2) /
                                 this.numSlots)
      let cellHeight = Math.floor((this.canvasHeight - this.minTopPadding * 2) /
                                  this.numChannels)

      if (cellWidth < cellHeight) {
        cellHeight = cellWidth
      } else {
        cellWidth = cellHeight
      }

      if (cellWidth < this.minCellWidth) {
        // the cell size is too small to show; make this.cells empty
        this.errorMessage = 'Slotframe is too long to display'
        this.$_app_status = 'ready'
      } else {
        // fill this.cells with cell objects
        let leftPadding = (this.canvasWidth - this.textWidth - cellWidth * this.numSlots) / 2
        let topPadding = (this.canvasHeight - this.textHeight - cellHeight * this.numChannels) / 2

        this.$_app_status = 'busy'
        this.generateCells(
          { cellWidth, cellHeight, leftPadding, topPadding },
          { slotOffset: 0, channelOffset: 0}
        )
      }
    },
    generateCells (config, startingCell) {

      for (let slotOffset = startingCell.slotOffset;
           slotOffset < this.numSlots;
           slotOffset++) {
        if (slotOffset - startingCell.slotOffset === 10) {
          // yield the CPU for other tasks
          const that = this
          setTimeout(() => {
            const startingCell = { slotOffset, channelOffset: 0 }
            that.generateCells(config, startingCell)
          }, 5)
          // return for now and resume the generation later
          return
        } else {
          this.cells[slotOffset] = []
        }
        for (let channelOffset = startingCell.channelOffset;
             channelOffset < this.numChannels;
             channelOffset++) {
          const x = ((slotOffset * config.cellWidth) + this.textWidth + config.leftPadding)
          const y = channelOffset * config.cellHeight + config.topPadding
          const cell = this.two.makeRectangle(x,
                                              y,
                                              config.cellWidth,
                                              config.cellHeight)

          if (slotOffset === 0 && (channelOffset % 5) === 0) {
            // put a channel offset label
            this.two.makeText(
              channelOffset,
              config.leftPadding,
              y,
              this.textStyles
            )
          }

          if (((slotOffset % 10) === 0) &&
              (channelOffset === (this.numChannels - 1))) {
            // put a slot offset label
            this.two.makeText(
              slotOffset,
              x,
              y + this.textHeight,
              this.textStyles
            )
          }

          // add a custom variable
          cell.numTxCells = 0
          this.cells[slotOffset].push(cell)
        }
      }
      this.two.update()
      this.matrixIsAvailable = true
      if (this.breakpoint.width < this.minBrowserWidthToDisplay) {
        this.errorMessage = "Browser is too small"
      } else {
        this.errorMessage = null
      }
      this.$_app_status = 'ready'
    },
    clearScheduleMatrix () {
      for (let slotOffset = 0; slotOffset < this.numSlots; slotOffset++) {
        if (this.cells[slotOffset] === undefined) {
          continue
        }
        for (let channelOffset = 0; channelOffset < this.numChannels; channelOffset++) {
          if (this.cells[slotOffset][channelOffset] === undefined) {
            continue
          }
          const cell = this.cells[slotOffset][channelOffset]
          cell.numTxCells = 0
          cell.noFill()
        }
      }
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
    },
    updateCounter (event) {
      let isTx = false
      let isRx = false
      let isShared = false
      let counter = null

      event.cellOptions.forEach(option => {
        if (option === 'TX') {
          isTx = true
        } else if (option === 'RX') {
          isRx = true
        } else if (option === 'SHARED') {
          isShared = true
        }
      })

      if (isTx === true && isRx === false && isShared === false) {
        counter = this.numTx
      } else if (isTx === true && isRx === false && isShared === true) {
        counter = this.numTxShared
      } else if (isTx === false && isRx === true && isShared === false) {
        counter = this.numRx
      } else if (isTx === true && isRx === true && isShared === false) {
        counter = this.numTxRx
      } else if (isTx === true && isRx === true && isShared === true) {
        counter = this.numTxRxShared
      }

      if (event.type === 'add') {
        counter.value += 1
      } else if (event.type === 'delete') {
        counter.value -= 1
      }
    },
    resetCounters () {
      this.numTx.value = 0
      this.numTxShared.value = 0
      this.numRx.value = 0
      this.numTxRx.value = 0
      this.numTxRxShared.value = 0
    }
  }
}
</script>
