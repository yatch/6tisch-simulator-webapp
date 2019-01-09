<template>
<v-flex xs3>
  <v-card height="100%">
    <v-container>
      <v-layout>
        <v-flex class="subheading">Overall E2E PDR:</v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <v-container>
            <v-layout class="title" justify-space-around my-2>
              <v-flex xs3 text-xs-right>
                <span class="title">{{ pdr }}</span>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12>
                <v-container pa-0 ma-0>
                  <v-layout justify-center>
                    <v-flex xs1>Send:</v-flex>
                    <v-flex xs6 text-xs-right>{{ numTx }}</v-flex>
                  </v-layout>
                  <v-layout justify-center>
                    <v-flex xs1>Recv:</v-flex>
                    <v-flex xs6 text-xs-right>{{ numRx }}</v-flex>
                  </v-layout>
                  <v-layout justify-center>
                    <v-flex xs1>Drop:</v-flex>
                    <v-flex xs6 text-xs-right>{{ numDrop }}</v-flex>
                  </v-layout>
                </v-container>
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
