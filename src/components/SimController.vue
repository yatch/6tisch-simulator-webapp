<template>
<v-card width="200px">
  <v-card-title>Controller</v-card-title>
  <v-card-text class="display-1 text-xs-center">
    {{ elapsedTime }}
  </v-card-text>
  <v-card-actions class="justify-center">
    <v-btn v-if="running" @click.stop="pauseSimulation()" icon outline color="primary">
      <v-icon>pause</v-icon>
    </v-btn>
    <v-btn v-else :disabled="ready === false && paused === false" @click.stop="startSimulation()" icon outline  color="primary">
      <v-icon>play_arrow</v-icon>
    </v-btn>
    <v-btn :disabled="running === false && paused === false" @click.stop="abortSimulation()" icon outline color="primary">
      <v-icon>stop</v-icon>
    </v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
export default {
  computed: {
    runningSettings () {
      return this.$store.state.settings
    },
    slotDuration () {
      return this.runningSettings.tsch_slotDuration
    },
    slotframeLength () {
      return this.runningSettings.tsch_slotframeLength
    },
    elapsedTime () {
      if (this.$store.state.currentSlotframeNumber === undefined) {
        return '0:00:00'
      } else {
        const seconds = (this.$store.state.currentSlotframeNumber *
                         this.slotframeLength *
                         this.slotDuration)
        const h = Math.floor(seconds / 3600).toString()
        const m = ('0' + Math.floor(seconds % 3600 / 60).toString()).slice(-2)
        const s = ('0' + Math.floor(seconds % 60).toString()).slice(-2)
        return h + ':' + m + ':' + s
      }
    },
    ready () {
      return (this.$store.state.simulator === 'ready' &&
              this.$store.state.settings !== undefined)
    },
    paused () { return this.$store.state.simulator === 'paused' },
    running () { return this.$store.state.simulator === 'running' }
  },
  methods: {
    startSimulation () {
      if (this.paused === true) {
        this.$store.dispatch('resumeSimulation')
      } else {
        this.$store.dispatch('startSimulation')
      }
    },
    pauseSimulation () {
      this.$store.dispatch('pauseSimulation')
    },
    resumeSimulation () {
      this.$store.dispatch('resumeSimulation')
    },
    abortSimulation () {
      this.$store.dispatch('abortSimulation')
    }
  }
}
</script>
