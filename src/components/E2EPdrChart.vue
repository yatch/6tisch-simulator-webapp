<template>
<v-card width="300px">
  <v-card-title>E2E PDR Trend (in last 10min)</v-card-title>
  <apexchart type="line" height="250px" :options="options" :series="series"/>
</v-card>
</template>

<script>
export default {
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
          tickAmount: 5,
          decimalsInFloat: 0
        }
      },
      series: [{
        name: 'E2E PDR',
        data: []
      }],
      numTx: 0,
      numRx: 0
    }
  },
  watch: {
    elapsedMinutes (newValue) {
      if (newValue === undefined) {
        // ignore
        return
      }
      this.series[0].data.push({
        x: newValue,
        y: this.pdr
      })
      this.series[0].data = this.series[0].data.slice(-10)
      this.numTx = 0
      this.numRx = 0
    },
    operationalStatus (newStatus, oldStatus) {
      if (newStatus === 'running' && oldStatus === 'ready') {
        this.reset()
      }
    },
    lastAppPacketEvent (event) {
      if (event === undefined) {
        // ignore
        return
      }
      this.numTx += 1
      if (event.type === 'rx') {
        this.numRx += 1
      }
    }
  },
  computed: {
    elapsedMinutes () { return this.$store.getters['log/elapsedMinutes'] },
    operationalStatus () {
      return this.$store.getters['simulator/operationalStatus']
    },
    lastAppPacketEvent () {
      return this.$store.getters['log/lastAppPacketEvent']
    },
    pdr () {
      if (this.numTx === 0) {
        return 0
      } else {
        return this.numRx / this.numTx * 100
      }
    }
  },
  methods: {
    reset () {
      this.series[0].data = []
      this.numTx = 0
      this.numRx = 0
    }
  }
}
</script>
