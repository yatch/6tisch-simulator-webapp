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
    <span>{{ connection }}</span>
  </v-tooltip>
  <v-spacer></v-spacer>
  <v-toolbar-side-icon @click.stop="navigationDrawer = !navigationDrawer"></v-toolbar-side-icon>
</v-toolbar>
</template>

<script>
export default {
  computed: {
    navigationDrawer: {
      get () { return this.$store.state.navigationDrawer },
      set (newValue) {
        return this.$store.dispatch('changeNavigationDrawerState', newValue)
      }
    },
    connection () { return this.$store.state.connection },
    color () {
      if (this.connection === 'connected') {
        return 'success'
      } else {
        return 'error'
      }
    },
    icon () {
      if (this.connection === 'connected') {
        return 'check'
      } else {
        return 'error'
      }
    }
  }
}
</script>
