<template>
<v-navigation-drawer fixed v-model="navigationDrawer" right app>
  <v-list dense>
    <v-list-tile to="/" @click.stop="navigationDrawer=false">
      <v-list-tile-action>
        <v-icon>home</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Dashboard</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile to="/config" @click.stop="navigationDrawer=false">
      <v-list-tile-action>
        <v-icon>settings</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Configuration</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile to="/results" @click.stop="navigationDrawer=false">
      <v-list-tile-action>
        <v-icon>folder</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Results</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile href="http://bitbucket.org/6tisch/simulator/src" target="_blank" @click.stop="navigationDrawer=false">
      <v-list-tile-action>
        <v-icon>code</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Source</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</v-navigation-drawer>
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
