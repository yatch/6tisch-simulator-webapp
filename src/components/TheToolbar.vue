<template>
<v-toolbar
  dense
  app
  >
  <v-toolbar-title class="headline text-uppercase">
    <span>6TiSCH</span>
    <span class="font-weight-light">Simulator</span>
  </v-toolbar-title>
  <v-spacer/>
  <TheConnectionStatus/>
  <v-toolbar-side-icon
    :disabled="disabled"
    @click="$_app_toggleNavigationDrawer()"
    />
</v-toolbar>
</template>

<script>
import App from '@/mixins/App'
import TheConnectionStatus from '@/components/TheConnectionStatus'

export default {
  components: {
    TheConnectionStatus
  },
  mixins: [App],
  computed: {
    disabled () {
      return (this.$_simulator_operationalStatus === 'running' ||
              this.$_simulator_operationalStatus === 'paused')
    }
  }
}
</script>
