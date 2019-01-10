<template>
<v-toolbar
  dense
  app
  >
  <v-tooltip bottom>
    <v-icon
      :color="$_simulator_connectionStatus | color"
      slot="activator"
      >
      {{ $_simulator_connectionStatus | icon }}
    </v-icon>
    <span>{{ $_simulator_connectionStatus }}</span>
  </v-tooltip>
  <v-toolbar-title class="headline text-uppercase">
    <span>6TiSCH</span>
    <span class="font-weight-light">Simulator</span>
  </v-toolbar-title>
  <v-spacer/>
  <v-toolbar-side-icon
    :disabled="disabled"
    @click="$_app_toggleNavigationDrawer()"
    />
</v-toolbar>
</template>

<script>
import App from '@/mixins/App'
import Simulator from '@/mixins/Simulator'

export default {
  mixins: [App, Simulator],
  computed: {
    disabled () {
      return (this.$_simulator_operationalStatus === 'running' ||
              this.$_simulator_operationalStatus === 'paused')
    }
  },
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
  }
}
</script>
