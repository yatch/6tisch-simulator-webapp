<template>
<span>
  <v-tooltip bottom>
    <v-icon
      :color="$_simulator_connectionStatus | color"
      slot="activator"
      >
      {{ $_simulator_connectionStatus | icon }}
    </v-icon>
    <span>{{ $_simulator_connectionStatus }}</span>
  </v-tooltip>
  <v-dialog v-model="dialog" persistent max-width="400">
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
</span>
</template>

<script>
import App from '@/mixins/App'
import Simulator from '@/mixins/Simulator'

export default {
  filters: {
    color (connectionStatus) {
      if (connectionStatus === 'connected') {
        return 'success'
      } else {
        return 'error'
      }
    },
    icon (connectionStatus) {
      if (connectionStatus === 'connected') {
        return 'check'
      } else {
        return 'error'
      }
    }
  },
  mixins: [App, Simulator],
  data () {
    return {
      dialog: false,
      timeToReload: 10,
      timePassed: 0
    }
  },
  computed: {
    remaining () { return this.timeToReload - this.timePassed }
  },
  watch: {
    $_simulator_connectionStatus (status) {
      if (status === 'disconnected') {
        this.$_app_settingsDialog = false
        this.$_app_aboutDialog = false
        this.dialog = true
        const that = this
        this.timer = setInterval(
          () => {
            that.timePassed += 1
          },
          1000
        )
      }
    },
    timePassed () {
      if (this.timeToReload <= this.timePassed) {
        this.reload()
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
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
