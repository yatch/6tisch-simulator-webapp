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
  computed: {
    appLatencySum () { return this.$store.state.appLatencySum },
    appLatencyNumRecords () { return this.$store.state.appLatencyNumRecords },
    appLatencyMax () {
      if (this.$store.state.appLatencyMax === undefined) {
        return 'N/A'
      } else {
        return this.$store.state.appLatencyMax.toFixed(2).toString()
      }
    },
    appLatencyMin () {
      if (this.$store.state.appLatencyMin === undefined) {
        return 'N/A'
      } else {
        return this.$store.state.appLatencyMin.toFixed(2).toString()
      }
    },
    appLatencyAvg () {
      if (this.$store.state.appLatencyNumRecords === 0) {
        return 'N/A'
      } else {
        return (this.appLatencySum / this.appLatencyNumRecords).toFixed(2).toString()
      }
    }
  }
}
</script>
