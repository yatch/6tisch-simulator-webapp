<template>
<BaseChartCard
  type="bar"
  :options="options"
  :series="series"
  >
  <span slot="help">
    Numbers of packet (unicast frame) drops with their drop reasons
  </span>
</BaseChartCard>
</template>

<script>
const LABEL_NO_ROUTE = 'No Route'
const LABEL_FULL_QUEUE = 'Full Queue'
const LABEL_NO_CELL = 'No Cell'
const LABEL_MAX_RETRUEIS = 'Max Retries'
const LABEL_TIME_EXCEEDED = 'Time Exceeded'
const LABEL_RANK_ERROR = 'Rank Error'
const LABEL_FULL_REASS_BUFFER = 'Full.ReassB'
const LABEL_FULL_VRB_TABLE = 'Full.VRBTbl'

import Simulation from '@/mixins/Simulation'
import Simulator from '@/mixins/Simulator'
import BaseChartCard from '@/components/BaseChartCard'

export default {
  components: {
    BaseChartCard
  },
  mixins: [Simulator, Simulation],
  data () {
    return {
      labels: [
        { reason: 'no_route', categoryLabel: LABEL_NO_ROUTE },
        { reason: 'txqueue_full', categoryLabel: LABEL_FULL_QUEUE },
        { reason: 'no_tx_cells', categoryLabel: LABEL_NO_CELL },
        { reason: 'max_retries', categoryLabel: LABEL_MAX_RETRUEIS },
        { reason: 'time_exceeded', categoryLabel: LABEL_TIME_EXCEEDED },
        { reason: 'rank_error', categoryLabel: LABEL_RANK_ERROR },
        {
          reason: 'reassembly_buffer_full',
          categoryLabel: LABEL_FULL_REASS_BUFFER
        },
        { reason: 'vrb_table_full', categoryLabel: LABEL_FULL_VRB_TABLE }
      ],
      options: {
        chart: {
          id: 'dropReason',
          toolbar: { show: false },
          animations: { enabled: false }
        },
        plotoptions: {
          distributed: true
        },
        datalabels: { enabled: false },
        xaxis: {
          categories: [
            LABEL_NO_ROUTE ,
            LABEL_FULL_QUEUE,
            LABEL_NO_CELL,
            LABEL_MAX_RETRUEIS,
            LABEL_TIME_EXCEEDED,
            LABEL_RANK_ERROR,
            LABEL_FULL_REASS_BUFFER,
            LABEL_FULL_VRB_TABLE
          ],
        },
        yaxis: { tickAmount: 5 }
      },
      series: [{
        data: [0, 0, 0, 0, 0, 0, 0, 0]
      }]
    }
  },
  computed: {
    latencyAvg () {
      if (this.numRecords === 0) {
        return 0
      } else {
        return this.latencySum / this.numRecords
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
    $_simulation_lastPacketDropEvent (event) {
      if (event !== null) {
        const newData = this.series[0].data.slice()
        const label = this.labels.find(x => {
          return x.reason  === event.dropReason
        })
        const index = this.options.xaxis.categories.findIndex(x => {
          return x === label.categoryLabel
        })
        newData[index] += 1
        // we need to assign a new object of 'sereis' so that the
        // chart is updated
        this.series = [{ data: newData }]
      }
    }
  },
  methods: {
    reset () {
      const newData = Array(this.options.xaxis.categories.length).fill(0)
      this.series = [{ data: newData }]
    }
  }
}
</script>
