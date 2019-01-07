<template>
<v-toolbar app>
  <v-toolbar-title class="headline text-uppercase">
    <span>6TiSCH</span>
    <span class="font-weight-light">Simulator</span>
  </v-toolbar-title>
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
    }
  }
}
</script>
