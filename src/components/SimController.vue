<template>
<v-flex xs3>
  <v-card height="100%">
    <v-container fill-height>
      <v-layout align-center justify-center row wrap>
        <v-flex xs12>
          <v-container pa-0 ma-0>
            <v-layout align-center justify-center wrap row>
              <v-flex xs5 class="text-xs-center">
                <span class="display-1">{{ hours }}</span>
                <span> h </span>
                <span class="display-1">{{ ('0' + minutes.toString()).slice(-2) }}</span>
                <span> m </span>
              </v-flex>
              <v-flex xs4>
                <v-chip color="info" text-color="white">
                  {{ sfClass }}
                </v-chip>
              </v-flex>
            </v-layout>
            <v-layout>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex xs12>
          <v-container pa-0 ma-0>
            <v-layout justify-center>
              <v-btn v-if="running" @click.stop="pauseSimulation()" icon outline color="primary">
                <v-icon>pause</v-icon>
              </v-btn>
              <v-btn v-else :disabled="ready === false && paused === false" @click.stop="startSimulation()" icon outline  color="primary">
                <v-icon>play_arrow</v-icon>
              </v-btn>
              <v-btn :disabled="running === false && paused === false" @click.stop="abortSimulation()" icon outline color="primary">
                <v-icon>stop</v-icon>
              </v-btn>
              <v-btn :disabled="ready === false" @click.stop="openConfigurator()" icon outline color="primary">
                <v-icon>settings</v-icon>
              </v-btn>
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
  computed: {
    elapsedMinutes () {
      return this.$store.getters['log/elapsedMinutes']
    },
    hours () {
      if (this.elapsedMinutes === undefined) {
        return 0
      } else {
        return Math.floor(this.elapsedMinutes / 60)
      }
    },
    minutes () {
      if (this.elapsedMinutes === undefined) {
        return 0
      } else {
        return Math.floor(this.elapsedMinutes % 60)
      }
    },
    operationalStatus () {
      return this.$store.getters['simulator/operationalStatus']
    },
    ready () { return this.operationalStatus === 'ready' },
    paused () { return this.operationalStatus === 'paused' },
    running () { return this.operationalStatus === 'running' },
    runningSettings () { return this.$store.getters['simulator/settings'] },
    sfClass () {
      if (this.runningSettings === undefined) {
        return 'unknown'
      } else {
        return this.runningSettings.sf_class
      }
    }
  },
  methods: {
    startSimulation () {
      if (this.paused === true) {
        this.$store.dispatch('simulator/resume')
      } else {
        this.$store.dispatch('simulator/start')
      }
    },
    pauseSimulation () {
      this.$store.dispatch('simulator/pause')
    },
    resumeSimulation () {
      this.$store.dispatch('simulator/resume')
    },
    abortSimulation () {
      this.$store.dispatch('simulator/abort')
    },
    openConfigurator () {
      this.$router.push('/config')
    }
  }
}
</script>
