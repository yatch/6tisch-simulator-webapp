<template>
<v-card width="200px">
  <v-tooltip bottom>
    <div slot="activator">
      <v-card-title>Overall E2E Latency</v-card-title>
      <v-card-text>
        <p><span class="title">Avg: {{ appLatencyAvg }} </span>s</p>
        <p><span class="title">Max: {{ appLatencyMax }} </span>s</p>
        <p><span class="title">Min: {{ appLatencyMin }} </span>s</p>
      </v-card-text>
    </div>
    <span>
      Average/Maximum/Minimum end-to-end latency of upward application
      packets in the entire simulation
    </span>
  </v-tooltip>
</v-card>
</template>

<script>
export default {
  data () {
    return {
      sum: 0,
      numRecords: 0,
      max: undefined,
      min: undefined
    }
  },
  watch: {
    operationalStatus (newState, oldState) {
      if (newState === 'running' && oldState === 'ready') {
        this.reset()
      }
    },
    lastAppPacketEvent (event) {
      if (event === undefined) {
        // ignore
        return
      } else if (event.type === 'rx') {
        const slotDuration = this.runningSettings.tsch_slotDuration
        const latency = ((event.asn - event.packet.app.timestamp) *
                         slotDuration)
        this.sum += latency
        this.numRecords += 1
        if (this.max === undefined || this.max < latency) {
          this.max = latency
        }
        if (this.min === undefined || latency < this.min) {
          this.min = latency
        }
      }
    }
  },
  computed: {
    operationalStatus () {
      return this.$store.getters['simulator/operationalStatus']
    },
    lastAppPacketEvent () {
      return this.$store.getters['log/lastAppPacketEvent']
    },
    runningSettings () {
      return this.$store.getters['simulator/settings']
    },
    appLatencyMax () {
      if (this.max === undefined) {
        return 'N/A'
      } else {
        return this.max.toFixed(2).toString()
      }
    },
    appLatencyMin () {
      if (this.min === undefined) {
        return 'N/A'
      } else {
        return this.min.toFixed(2).toString()
      }
    },
    appLatencyAvg () {
      if (this.numRecords === 0) {
        return 'N/A'
      } else {
        return (this.sum / this.numRecords).toFixed(2).toString()
      }
    }
  },
  methods: {
    reset () {
      this.sum = 0
      this.numRecords = 0
      this.max = undefined
      this.min = undefined
    }
  }
}
</script>
