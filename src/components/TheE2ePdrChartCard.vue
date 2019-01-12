<template>
<BaseChartCard
  type="line"
  :options="options"
  :series="series"
  >
  <span slot="help">
    E2E PDR trend in the last 10 minutes. Each sample is the E2E PDR
    value within a given minute window.
  </span>
</BaseChartCard>
</template>

<script>
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
      options: {
        chart: {
          id: 'pdr',
          group: 'sync-charts',
          toolbar: { show: false },
          animations: { enabled: false }
        },
        legend: { showForSingleSeries: true },
        xaxis: { labels: { show: false } },
        yaxis: {
          min: 0,
          max: 100,
          tickAmount: 5
        }
      },
      series: [{
        name: 'E2E PDR (%)',
        data: [{ x: 0, y: 0}]
      }],
      numTx: 0,
      numRx: 0
    }
  },
  computed: {
    pdr () {
      if (this.numTx === 0) {
        return 0
      } else {
        return this.numRx / this.numTx * 100
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
    $_simulation_elapsedMinutes (newValue) {
      if (newValue !== null) {
        this.series[0].data.push({
          x: newValue,
          y: this.pdr
        })
        this.series[0].data = this.series[0].data.slice(-10)
        this.numTx = 0
        this.numRx = 0
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
      this.series[0].data = [{ x: 0, y: 0}]
      this.numTx = 0
      this.numRx = 0
    }
  }
}
</script>
