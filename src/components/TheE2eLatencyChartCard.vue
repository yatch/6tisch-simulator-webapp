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
          id: 'latency',
          group: 'sync-charts',
          toolbar: { show: false },
          animations: { enabled: false }
        },
        legend: { showForSingleSeries: true },
        xaxis: { labels: { show: false } },
        yaxis: {
          tickAmount: 6,
          decimalsInFloat: 0
        }
      },
      series: [
        {
          name: 'Avg E2E Lat (s)',
          data: [{ x: 0, y: 0}]
        },
        {
          name: 'Max E2E Lat (s)',
          data: [{ x: 0, y: 0}]
        }
      ],
      numRecords: 0,
      latencySum: 0,
      latencyMax: 0
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
    $_simulation_elapsedMinutes (newValue) {
      if (newValue !== null) {
        // update Avg
        this.series[0].data.push({
          x: newValue,
          y: this.latencyAvg
        })
        this.series[0].data = this.series[0].data.slice(-10)

        // update Max
        this.series[1].data.push({
          x: newValue,
          y: this.latencyMax
        })
        this.series[1].data = this.series[1].data.slice(-10)

        // reset the counters
        this.numRecords = 0
        this.latencySum = 0
        this.latencyMax = 0
      }
    },
    $_simulation_lastlastAppPacketEvent (event) {
      if (event !== null && event.type === 'rx') {
        const latency = ((event.asn - event.packet.app.timestamp) *
                         this.$_simulator_settings.tsch_slotDuration)
        this.numRecords += 1
        this.latencySum += latency
        if (this.latencyMax === undefined || this.latencyMax < latency) {
          this.latencyMax = latency
        }
      }
    }
  },
  methods: {
    reset () {
      this.series[0].data = [{ x: 0, y: 0}]
      this.series[1].data = [{ x: 0, y: 0}]
      this.numRecords = 0
      this.latencySum = 0
      this.latencyMax = 0
    }
  }
}
</script>
