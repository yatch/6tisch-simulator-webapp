<template>
<v-card width="300px">
  <v-card-title>E2E Latency Trend (in last 10min)</v-card-title>
  <apexchart type="line" height="250px" :options="options" :series="series"/>
</v-card>
</template>

<script>
export default {
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
          tickAmount: 5,
          decimalsInFloat: 0
        }
      },
      series: [
        {
          name: 'Avg.',
          data: []
        },
        {
          name: 'Max.',
          data: []
        }
      ],
      numRecords: 0,
      latencySum: 0,
      latencyMax: 0
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
        y: this.latencyAvg
      })
      this.series[0].data = this.series[0].data.slice(-10)
      this.series[1].data.push({
        x: newValue,
        y: this.latencyMax
      })
      this.series[1].data = this.series[1].data.slice(-10)
      this.numRecords = 0
      this.latencySum = 0
      this.latencyMax = 0
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
      } else if (event.type === 'rx') {
        const latency = ((event.asn - event.packet.app.timestamp) *
                         this.slotDuration)
        this.numRecords += 1
        this.latencySum += latency
        if (this.latencyMax === undefined || this.latencyMax < latency) {
          this.latencyMax = latency
        }
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
    slotDuration () {
      return this.$store.getters['simulator/settings'].tsch_slotDuration
    },
    latencyAvg () {
      if (this.numRecords === 0) {
        return 0
      } else {
        return this.latencySum / this.numRecords
      }
    }
  },
  methods: {
    reset () {
      this.series[0].data = []
      this.series[1].data = []
      this.numRecords = 0
      this.latencySum = 0
      this.latencyMax = 0
    }
  }
}
</script>
