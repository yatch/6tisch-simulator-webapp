<template>
<v-card width="200px">
  <v-tooltip bottom>
    <div slot="activator">
      <v-card-title>Overall E2E PDR</v-card-title>
      <v-card-text>
        <p class="title">PDR: {{ pdr }}</p>
        <div>Send: {{ numTx }}</div>
        <div>Recv: {{ numRx }}</div>
        <div>Drop: {{ numDrop }}</div>
      </v-card-text>
    </div>
    <span>
      End-to-end Packet Delivery Ratio in the entire simulation
    </span>
  </v-tooltip>
</v-card>
</template>

<script>
export default {
  data () {
    return {
      numTx: 0,
      numRx: 0,
      numDrop: 0
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
      } else {
        this.numTx += 1
        if (event.type === 'rx') {
          this.numRx += 1
        } else {
          this.numDrop += 1
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
    pdr () {
      if (this.numTx === 0) {
        return 'N/A'
      } else {
        return (this.numRx / this.numTx * 100).toFixed(3).toString() + '%'
      }
    }
  },
  methods: {
    reset () {
      this.numTx = 0
      this.numRx = 0
      this.numDrop = 0
    }
  }
}
</script>
