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
    elapsedMinutes () {
      return this.$store.getters['log/elapsedMinutes']
    },
    elapsedTime () {
      if (this.elapsedMinutes === undefined) {
        return '0h00m'
      } else {
        const minutes = this.elapsedMinutes
        const h = Math.floor(minutes / 60).toString()
        const m = ('0' + Math.floor(minutes % 60).toString()).slice(-2)
        return h + 'h' + m + 'm'
      }
    },
    operationalStatus () {
      return this.$store.getters['simulator/operationalStatus']
    },
    ready () { return this.operationalStatus === 'ready' },
    paused () { return this.operationalStatus === 'paused' },
    running () { return this.operationalStatus === 'running' }
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
    }
  }
}
</script>
