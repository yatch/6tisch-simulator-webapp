<template>
<v-navigation-drawer fixed v-model="show" mobile-break-point="false" right app>
  <v-list dense>
    <v-list-tile to="/" @click.stop="toggleNavigationDrawer()">
      <v-list-tile-action>
        <v-icon>home</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Dashboard</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile to="/config" @click.stop="toggleNavigationDrawer()">
      <v-list-tile-action>
        <v-icon>settings</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Configuration</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile to="/results" @click.stop="toggleNavigationDrawer()">
      <v-list-tile-action>
        <v-icon>folder</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Results</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile href="http://bitbucket.org/6tisch/simulator/src" target="_blank" @click.stop="toggleNavigationDrawer()">
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
    show: {
      get () { return this.$store.getters['app/navigationDrawer'] },
      set (value) {
        if (value !== this.show) {
          this.toggleNavigationDrawer()
        }
      }
    }
  },
  methods: {
    toggleNavigationDrawer () {
      this.$store.dispatch('app/toggleNavigationDrawer')
    }
  }
}
</script>
