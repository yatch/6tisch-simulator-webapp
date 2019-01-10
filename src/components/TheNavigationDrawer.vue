<template>
<v-navigation-drawer
  fixed
  temporary
  v-model="drawer"
  mobile-break-point="false"
  right
  app
  >
  <v-list dense>
    <v-list-tile
      v-for="item in items"
      :to="item.path"
      :key="item.name"
      @click.stop="close"
      >
      <v-list-tile-action>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>
          {{ item.name }}
        </v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          name: 'Dashboard',
          path: '/',
          icon: 'home'
        }
      ]
    }
  },
  computed: {
    drawer: {
      get () { return this.$store.getters['app/navigationDrawer'] },
      set (value) {
        if (value !== this.drawer) {
          this.$store.dispatch('app/toggleNavigationDrawer')
        }
      }
    },
  },
  methods: {
    close () { this.drawer = false }
  }
}
</script>
