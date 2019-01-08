<template>
<v-dialog v-model="dialog" persistent max-width="450">
  <v-card>
    <v-layout>
      <v-card-title class="title" primary-title>
        Disconnected from Backend
      </v-card-title>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-card-text class="subheading">
          Reloading the WebApp in {{ remaining }}s ...
        </v-card-text>
      </v-flex>
    </v-layout>
    <v-layout align-center justify-center row>
      <v-card-actions>
        <v-btn @click.stop="stopTimer()" color="error">
          Cancel
        </v-btn>
        <v-btn @click.stop="reload()" color="info">
          Reload Now
        </v-btn>
      </v-card-actions>
    </v-layout>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  props: {
    timeToReload: {
      default: 10,
      type: Number
    }
  },
  data () {
    return {
      dialog: false,
      timePassed: 0
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  watch: {
    timePassed () {
      if (this.timeToReload <= this.timePassed) {
        this.reload()
      }
    },
    connectionStatus (newState, oldState) {
      if (newState === 'disconnected' && oldState === 'connected') {
        this.dialog = true
        this.timer = setInterval(() => { this.timePassed += 1 }, 1000)
      }
    }
  },
  computed: {
    connectionStatus () {
      return this.$store.getters['simulation/connectionStatus']
    },
    remaining () { return this.timeToReload - this.timePassed }
  },
  methods: {
    stopTimer () {
      clearInterval(this.timer)
      this.dialog = false
    },
    reload () {
      this.stopTimer()
      location.reload()
    }
  }
}
</script>
