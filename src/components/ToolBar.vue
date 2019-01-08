<template>
<v-toolbar app>
  <v-toolbar-title class="headline text-uppercase">
    <span>6TiSCH</span>
    <span class="font-weight-light">Simulator</span>
  </v-toolbar-title>
  <v-tooltip bottom>
    <v-chip small light slot="activator">
      <span>status</span>
      <v-icon :color="color">{{ icon }}</v-icon>
    </v-chip>
    <span>{{ connectionStatus }}</span>
  </v-tooltip>
  <v-spacer></v-spacer>
  <v-toolbar-side-icon @click.stop="toggleNavigationDrawer()"></v-toolbar-side-icon>
</v-toolbar>
</template>

<script>
export default {
  computed: {
    navigationDrawer () { return this.$store.getters['app/navigationDrawer'] },
    connectionStatus () { return this.$store.getters['simulator/connectionStatus'] },
    color () {
      if (this.connectionStatus === 'connected') {
        return 'success'
      } else {
        return 'error'
      }
    },
    icon () {
      if (this.connectionStatus === 'connected') {
        return 'check'
      } else {
        return 'error'
      }
    }
  },
  methods: {
    toggleNavigationDrawer () { this.$store.dispatch('app/toggleNavigationDrawer') }
  }
}
</script>
