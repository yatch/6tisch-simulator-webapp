<template>
<v-flex xs3>
  <v-card height="100%">
    <v-container>
      <v-layout>
        <v-flex class="subheading">
          Overall E2E Latency:
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <v-container>
            <v-layout class="title" justify-space-around my-2>
              <v-flex xs2>Avg</v-flex>
              <v-flex xs6 text-xs-right>
                {{ appLatencyAvg }}
                <span v-if="showAvgTrailingS">s</span>
              </v-flex>
            </v-layout>
            <v-layout class="title" justify-space-around my-2>
              <v-flex xs2>Max</v-flex>
              <v-flex xs6 text-xs-right>
                {{ appLatencyMax }}
                <span v-if="showMaxTrailingS">s</span>
              </v-flex>
            </v-layout>
            <v-layout class="title" justify-space-around my-2>
              <v-flex xs2>Min</v-flex>
              <v-flex xs6 text-xs-right>
                {{ appLatencyMin }}
                <span v-if="showMinTrailingS">s</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</v-flex>
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
    },
    showMaxTrailingS () { return this.appLatencyMax !== 'N/A' },
    showMinTrailingS () { return this.appLatencyMin !== 'N/A' },
    showAvgTrailingS () { return this.appLatencyAvg !== 'N/A' }
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
